var Model = require('mongoose').Model;

module.exports = function MongooseParanoidPlugin(schema, options) {
    if (schema.options.paranoid !== true) {
        return; // skip overriding native methods if paranoid is not enabled explicitly
    }

    var field = options.field || 'deletedAt';

    schema.add({
        [field]: {
            type: Date
        }
    });

    ['find', 'findOne', 'updateOne', 'count', 'update'].forEach(function (method) {
        schema.static(method, function () {
            var args = Array.from(arguments);
            var isParanoidManuallyDisabled = args && args[2] && args[2].paranoid === false;

            if (this.isParanoidDisabled || isParanoidManuallyDisabled) {
                return Model[method].apply(this, arguments);
            }

            return Model[method].apply(this, arguments).where(field).exists(false);
        });
    });

    schema.static('restore', function (conditions, options, callback) {
        options.paranoid = false;

        return this.update(conditions, {
            $unset: { [field]: '' },
        }, options, callback);
    });

    ['deleteMany', 'deleteOne', 'remove'].forEach(function(method) {
        schema.static(method, function(conditions, options, callback) {
            if (options && typeof options === 'function') {
                callback = options;
            }

            var isParanoidManuallyDisabled = options && options.paranoid === false;

            if (this.isParanoidDisabled || isParanoidManuallyDisabled) {
                return Model[method].apply(this, [conditions, callback]);
            }

            if (method === 'deleteMany') {
                return this.updateMany(conditions, {
                    [field]: new Date()
                }, options, callback)
            } else {
                return this.updateOne(conditions, {
                    [field]: new Date()
                }, options, callback)
            }
        });
    });
};

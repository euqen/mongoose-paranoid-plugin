var Model = require('mongoose').Model;

module.exports = function MongooseParanoidPlugin(schema, options) {
    var field = options.field || 'deletedAt';
    
    schema.add({
        [field]: {
            type: Date
        }
    });

    ['find', 'findOne', 'updateOne', 'count', 'update'].forEach(function (method) {
        schema.static(method, function () {
            var isParanoidDisabled = schema.options.paranoid !== true || this.paranoidOpt === false;

            if (isParanoidDisabled) {
                return Model[method].apply(this, arguments);
            }

            return Model[method].apply(this, arguments).where(field).exists(false);
        });
    });

    schema.static('paranoid', function(paranoid) {
        this.paranoidOpt = paranoid;

        return this;
    });

    schema.static('restore', function (conditions, callback) {
        return this.paranoid(false).update(conditions, {
            [field]: undefined,
        }, { multi: true }, callback);
    });

    schema.static('deleteOne', function(conditions, callback) {
        var isParanoidDisabled = schema.options.paranoid !== true || this.paranoidOpt === false;

        if (isParanoidDisabled) {
            return Model.deleteOne.apply(this, arguments);
        }

        return this.update(conditions, {
            [field]: new Date(),
        }, callback);
    });
};
var Model = require('mongoose').Model;

module.exports = function MongooseParanoidPlugin(schema) {
    schema.add({
        deletedAt: {
            type: Date
        }
    });

    ['find', 'findOne', 'updateOne', 'count'].forEach(function (method) {
        schema.static(method, function () {
            var isParanoidDisabled = schema.options.paranoid !== true || this.paranoidOpt === false;

            if (isParanoidDisabled) {
                return Model[method].apply(this, arguments);
            }

            return Model[method].apply(this, arguments).where('deletedAt').exists(false);
        });
    });

    schema.static('paranoid', function(paranoid) {
        this.paranoidOpt = paranoid;

        return this;
    });

    schema.static('restore', function (conditions, callback) {
        return this.paranoid(false).update(conditions, {
            deletedAt: undefined,
        }, { multi: true }, callback);
    });
};
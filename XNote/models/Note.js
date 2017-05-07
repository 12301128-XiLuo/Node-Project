//note entity 
var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

    identity: 'note',
    connection: 'mysql',

    attributes: {
        id: {
            type: 'integer',
            primaryKey:true,
            autoIncrement: true
        },
        title: {
            type: 'string'
        },
        key: {
            type: 'string'
        },
        content: {
            type: 'string'
        },
        user_name: {
            type: 'string'
        },
        create_time: {
            type: 'date',
            defaultsTo:new Date()
        }
    }
});
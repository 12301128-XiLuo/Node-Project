var Waterline = require('waterline');

var mysqlAdapter = require('sails-mysql');


// models
var User = require('../models/User');

var orm = new Waterline();
var wlconfig = {
    adapters: {
        'default': mysqlAdapter,
        mysql: mysqlAdapter
    },
    connections: {
        'mysql': {
            adapter: 'mysql',
            host: '60.205.220.42',
            user: 'root',
            password: '123456',
            chartset:'utf8',
            database:'mynode'
        }
    }
};
orm.loadCollection(User);

exports.orm = orm;
exports.config = wlconfig;
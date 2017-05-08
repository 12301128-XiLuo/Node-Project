var Waterline = require('waterline');

var mysqlAdapter = require('sails-mysql');


// models
var User = require('../models/User');
var Note = require('../models/Note');

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
orm.loadCollection(Note);

exports.orm = orm;
exports.config = wlconfig;
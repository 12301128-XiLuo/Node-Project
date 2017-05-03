// var mongoose = require('mongoose');
// var db = mongoose.connect('mongodb://60.205.220.42/wechat');
// vat Schema = mongoose.Schema;
// var tokenSchema = new Schema({
// 	access_token : String
// });

// exports.tokens = db.model('tokens',tokenSchema);

var settings = require('./settings'),
        Db = require('mongodb').Db,
        Connection = require('mongodb').Connection,
        Server = require('mongodb').Server;
module.exports = new Db(settings.db, new Server(settings.host, settings.port),{safe: true});
var mongoose = require('mongoose');

var connection = mongoose.createConnection('mongodb://60.205.220.42/xblog', function (err) {
  if (err) throw err;
});
var Schema = mongoose.Schema;

var schema = new Schema({
  name: String,
  passwd: String
});
connection.model('user',schema);
var user = connection.model('user');
//要插入的数据
var u = new user({
  name: 'WANG2',
  passwd: 'abc',
});
//增
u.save(function (err, ret) {
  if (err) throw err;
  console.log(ret);
});

//查
user.find({},function (err, ret) {
  if (err) throw err;
  console.log(ret);
  connection.close();
});

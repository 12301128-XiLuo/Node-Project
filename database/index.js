var mysql = require('mysql');
//建立连接
var connection = mysql.createConnection({
  host: '60.205.220.42',
  user: 'root',
  password: '123456',
  database: 'mynode'
});
//连接数据库并进行查询
connection.connect(function (err) {
  if (err) throw err;
  // connection.query('SELECT * FROM user', function (err, ret) {
  //   if (err) throw err;
  //   console.log(ret);
  //   connection.end();
  // });
  var value = 'xixi" OR "1"="1';
  //var query =  connection.query('SELECT * FROM user where name="'+value+'"', function (err, ret) {
  var query =  connection.query('SELECT * FROM user where name=?',value, function (err, ret) {
    if (err) throw err;

    console.log(ret);
    connection.end();
  });

  console.log(query.sql);
});


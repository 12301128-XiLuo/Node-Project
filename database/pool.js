var mysql = require('mysql');
//建立连接池
var pool = mysql.createPool({
  connectionLimit: 3,
  host: '60.205.220.42',
  user: 'root',
  password: '123456',
  database: 'mynode'
});

// pool.getConnection(function (err, connection) {
//   if (err) throw err;

//   var value = 'xixi';
//   var query = connection.query('SELECT * FROM user WHERE name=?', value, function (err, ret) {
//     if (err) throw err;

//     console.log(ret);
//     connection.release();
//   });
//   console.log(query.sql);
// });

/**
 * [startQuery 连接上连接池进行查询] */
function startQuery(){
  pool.getConnection(function (err, connection) {
    if (err) throw err;

    var value = 'xixi';
    var query = connection.query('SELECT * FROM user WHERE name=?', value, function (err, ret) {
      if (err) throw err;

      console.log(ret);
      setTimeout(function () {
        connection.release();
        }, 1000);
    });
    console.log(query.sql);
  });
}

//模拟达到连接上线
for (var i = 0; i < 10; i++) {
  startQuery();
}

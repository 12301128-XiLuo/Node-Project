var MongoClient = require('mongodb').MongoClient;

// Connection URL
var url = 'mongodb://60.205.220.42/xblog';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  if(err) throw err;
  console.log("Connected correctly to server");
  //插入数据
  // db.collection('user').save({name:'yoyo',passwd:'78'},function(err,ret){
  //       if(err) throw err;
  //       console.log(ret);
  // });
  //查询全部数据
  //  db.collection('user').find().toArray(function(err,list){
  //       if(err) throw err;
  //       console.log(list);
  // });
  //查询条件
  // db.collection('user').find({"name":"xixi"}).toArray(function(err,list){
  //       if(err) throw err;
  //       console.log(list);
  // });
  
  //跳过两条数据，再查询两条数据
  db.collection('user').find().skip(2).limit(2).toArray(function(err,list){
        if(err) throw err;
        console.log(list);
  });
});

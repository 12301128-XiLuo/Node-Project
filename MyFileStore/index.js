var session = require('express-session');
var MyFileStore = require('./lib/my-session-file-store')(session);
var express = require('express');
var app = express();

var fileName = './file'
app.use(session({
    store: new MyFileStore(fileName),
    secret: 'xixi'
}));

app.get('/', function (req, res) {
  if (req.session.views) {
    req.session.views++;
    res.setHeader('Content-Type', 'text/html');
    res.write('<p>views: ' + req.session.views + '</p>');
    res.end();
  } else {
    req.session.views = 1;
    res.end('Welcome to the file session demo. Refresh page!');
  }
});

var server = app.listen(1337, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
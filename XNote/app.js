var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
//add by xixi
var settings = require('./settings');
var flash = require('connect-flash');
var http = require('http');
var path = require('path');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var waterline = require('./config/waterline');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
app.engine('html', require('ejs').__express);  
app.set('view engine', 'html');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: settings.cookieSecret,
  key: settings.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 7},//30 days
  store: new MongoStore({
    db: settings.db,
    host: settings.host,
    port: settings.port,
    url: settings.url
  })
}));
app.use(flash());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
    req.models = app.get('models');
    next();
  });

app.use('/', index);
app.use('/users', users);

app.use('/register',index);
app.use('/logout',index);
app.use('/home',index);
app.use('/post',index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

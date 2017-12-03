var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var index = require('./routes/index');
var config = require('./config/config');
var users = require('./routes/users');
var channels = require('./routes/channels');
var youtube = require('./routes/youtube');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session -- using memory storage
// look into postgres-based session storage
app.use(session({
  secret: 'averyverysecretvaluesolikedonteventrytocvrakdis',
  saveUninitialized: false,
  resave: false
}));

// static routes for images, css, etc.
app.use('/images', express.static(__dirname + '/assets/images'));
app.use('/css', express.static(__dirname + '/assets/css'));

app.use('/', index);
app.use('/users', users);
app.use('/channels', channels);
app.use('/youtube', youtube);

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

// workaround for http code 304 getting cached or "stuck" somehow
app.disable('etag');

module.exports = app;

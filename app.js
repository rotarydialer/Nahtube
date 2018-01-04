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
var activity = require('./activity');
var channels = require('./routes/channels');
var youtube = require('./routes/youtube');
var parents = require('./routes/parents');

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

// session -- using memory storage
// look into postgres-based session storage
// TODO: move secret to .env
app.use(session({
  secret: "immaputthisonmorelinesilikemoarlinesmorelinesmoreclarityialwayssay",
  saveUninitialized: false,
  resave: false
}));

// middleware to make 'user' available to all templates
app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// static routes for images, css, etc.
app.use('/images', express.static(__dirname + '/assets/images'));
app.use('/css', express.static(__dirname + '/assets/css'));

app.use('/', index);
app.use('/users', users);
app.use('/channels', channels);
app.use('/youtube', youtube);
app.use('/parents', parents);

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

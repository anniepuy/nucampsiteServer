var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
var logger = require('morgan');

//const session = require('express-session');
//const FileStore = require('session-file-store')(session);

//authenication
const passport = require('passport');
//const config = require('./authenitcate');

const config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//routes
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');

const mongoose = require('mongoose');
const req = require('express/lib/request');

const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

connect.then(()=> console.log('Connected correctly to server'),
  err => console.log(err)
);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//adding passport js methods using sessions
app.use(passport.initialize());


//moved routes before auth to allow users to register
app.use('/', indexRouter);
app.use('/users', usersRouter);


/*
 Authentication removed with Tokens
function auth(req, res, next) {
  console.log(req.user);

  if (!req.user) {
      const err = new Error('You are not authenicated!');
      res.statusCode = 401;
      return next(err);
  } else {
      return next(err);
  }
}

remove wk 3, token auth
app.use(auth)
*/

app.use(express.static(path.join(__dirname, 'public')));


//custom routes
app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

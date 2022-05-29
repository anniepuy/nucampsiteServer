var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');


//authenication
const passport = require('passport');

const config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//routes
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');
const uploadRouter = require('./routes/uploadRouter');

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

//routing method to catch all requests to server
app.all('*', (req, res, next)=> {
  if (req.secure) {
    return next();
  } else {
    console.log(`Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`);
    res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`);
  }
});

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

app.use(express.static(path.join(__dirname, 'public')));


//custom routes
app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);
app.use('/imageUpload', uploadRouter);

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

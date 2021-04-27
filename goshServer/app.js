var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyPaser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');
var cors = require('cors')

var index = require('./routes/index');
var users = require('./routes/users');
var reagentRouter = require('./routes/reagentRouter');
var secReagentRouter = require('./routes/secReagentRouter');
var testRouter = require('./routes/testRouter');
var testTypeRouter = require('./routes/testTypeRouter');

const mongoose = require('mongoose');

const url = config.mongoUrl;
const connect = mongoose.connect(url, { useNewUrlParser: true });

connect.then((db) => {
  console.log('Connected correctly to server');
}, (err) => {console.log(err); });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyPaser.json());
app.use(bodyPaser.urlencoded({ extended: false }))
app.use(cors()) // cors

app.use(passport.initialize());

app.use('/', index);
app.use('/users', users);

app.use(express.static(path.join(__dirname, 'public')));

//deployment
// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'))
// })

// app.get('/inventory/primary-reagents/overview', function (req, res) {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'))
// })

// app.get('/inventory/secondary-reagents/overview', function (req, res) {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'))
// })

app.use('/reagents', reagentRouter);
app.use('/secondary-reagents', secReagentRouter);
app.use('/tests', testRouter);
app.use('/test-types', testTypeRouter);

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

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var signRouter = require('./routes/sign');
var reservationRouter = require('./routes/reservation');
var scheduleRouter = require('./routes/schedule');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/sign', signRouter);
app.use('/reservation', reservationRouter);
app.use('/schedule', scheduleRouter);

module.exports = app;

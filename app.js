var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var cors = require('cors')

var mysql = require('mysql')
const cipher = require('./cipher');
// For adding timetable to database
// const getTimetable = require('./getTimetable');

var signRouter = require('./routes/sign');
var reservationRouter = require('./routes/reservation');
var scheduleRouter = require('./routes/schedule');


// MySQL Connection
global.conn = mysql.createConnection(
  {
    host: cipher.host,
    user: cipher.user,
    password: cipher.password,
    database: cipher.database,
    multipleStatements: true
  }
)

// For adding timetable to database
// global.updateTime = Date.now()

conn.connect((err) => {
  if(err != null) console.log("Cannot connect MySQL Server!: \n" + err)
  else console.log("MySQL Connection Successful!")
});

// For adding timetable to database
// console.log("Start at: " + updateTime)

var app = express();

app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/sign', signRouter);
app.use('/api/reservation', reservationRouter);
app.use('/api/schedule', scheduleRouter);

// For adding timetable to database
// getTimetable().then(() => {
//   console.log("Timetable all set!")
// });



module.exports = app;



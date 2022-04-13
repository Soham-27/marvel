let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let client = require("./db/connect");



let indexRouter = require('./routes/index');
const userRouter = require("./routes/user");

let app = express();

client
  .connect()
  .then(() => console.log("connected"))
  .catch((err) => console.error("connection error", err.stack));
  
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/user",userRouter);

app.use('/', indexRouter);

module.exports = app;

let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let client = require("./db/connect");
var cors = require('cors')



let indexRouter = require('./routes/index');
const userRouter = require("./routes/user");
const userEventsRouter = require("./routes/user_events");
const webappRouter= require("./routes/webapp");
const paperRouter= require("./routes/paperpresentation");
const photoshopRouter= require("./routes/photoshop");
const insightRouter= require("./routes/insight");

let app = express();

client
  .connect()
  .then(() => console.log("connected"))
  .catch((err) => console.error("connection error", err.stack));
  
app.use(cors()) 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/user",userRouter);
app.use("/user_events", userEventsRouter);
app.use("/webapp", webappRouter);
app.use("/paper", paperRouter);
app.use("/photoshop", photoshopRouter);
app.use("/insight",insightRouter);

app.use('/', indexRouter);

module.exports = app;

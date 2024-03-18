const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connectToDatabase = require('./config/mongoose');
const session = require('express-session');
const nocache = require("nocache")
const errorHandlerMiddleware = require('./config/error_handler');

const adminRouter = require('./routes/admin');
const usersRouter = require('./routes/users');

const app = express();

app.use(nocache());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(session({ secret: "key", resave: true, saveUninitialized: true, cookie: { maxAge: 600000 } }));

app.use(
  session({
    secret: "key",
    cookie: { maxAge:60*60*1000},
    saveUninitialized: true,
    resave: true,
  })
);
app.locals.add=[]
app.use('/admin', adminRouter);
app.use('/', usersRouter);

connectToDatabase();

  app.listen(3000,()=>{
    console.log('server started on port 3000')
  })

  app.use(errorHandlerMiddleware);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;

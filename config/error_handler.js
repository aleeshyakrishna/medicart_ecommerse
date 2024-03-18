const createError = require('http-errors');

function errorHandlerMiddleware(err, req, res, next) {
  // Catch 404 and forward to error handler
  if (!res.headersSent) {
    res.status(404);
    next(createError(404));
  }

  // Error handler
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}

module.exports = errorHandlerMiddleware;

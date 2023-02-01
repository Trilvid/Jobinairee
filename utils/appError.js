class AppError extends Error {
    constructor(message, statusCode) {

      super(message);
  
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4'|| 5) ? 'fail' : 'error';
      this.isOperational = true;
  
      // res.status(statusCode).json({
      //   status: "Fail",
      //   message: message
      // });

      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = AppError;
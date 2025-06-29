/**
 * Custom error response handler
 */
const errorHandler = (err, req, res, next) => {
  // Log error for server-side debugging
  console.error(err.stack.red);
  
  // Get status code from error or default to 500
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

/**
 * Custom error class with status code
 */
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Async handler to avoid try-catch blocks in controllers
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = {
  errorHandler,
  ErrorResponse,
  asyncHandler
}; 
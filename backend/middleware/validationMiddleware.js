const { validationResult } = require('express-validator');
const { ErrorResponse } = require('./errorMiddleware');

/**
 * Middleware to validate request data
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Get the first error message
    const message = errors.array()[0].msg;
    return next(new ErrorResponse(message, 400));
  }
  next();
};

module.exports = {
  validate
}; 
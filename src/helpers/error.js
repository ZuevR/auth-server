class AppError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const throwAppError = (status, message) => {
  throw new AppError(status, message);
};

const handleError = (err, res) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'SequelizeValidationError') {
    statusCode = err.errors[0].validatorKey === 'isUnique' ? 409 : 400;
    message = err.errors[0].message;
  }

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message
  });
};

module.exports = {
  AppError,
  throwAppError,
  handleError
};

const { throwAppError } = require('../helpers/error');

const checkRequiredData = (req, res, next) => {
  if (!req.body.email) throwAppError(400, 'The email is required');
  if (!req.body.password) throwAppError(400, 'The password is required');
  next();
};

const checkJwtAuthentication = (req, res, next) => {};

module.exports = { checkRequiredData };

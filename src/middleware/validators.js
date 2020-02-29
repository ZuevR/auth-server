const { throwAppError } = require('../helpers/error');
const { verifyAccessToken } = require('../helpers/perform-jwt');
const checkRequiredData = (req, res, next) => {
  if (!req.body.email) throwAppError(400, 'The email is required');
  if (!req.body.password) throwAppError(400, 'The password is required');
  next();
};

const checkJwtAuthentication = (req, res, next) => {
  try {
    let token = '';
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      token = req.headers.authorization.split(' ')[1];
    } else {
      throwAppError(401, 'You are not authorized to perform this operation');
    }
    req.jwtData = verifyAccessToken(token);
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkRequiredData,
  checkJwtAuthentication
};

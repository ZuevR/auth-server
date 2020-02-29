const jwt = require('jsonwebtoken');
const config = require('config');
const { throwAppError } = require('./error');

const generateAccessToken = (payload = {}, lifeTime) => jwt.sign(
  payload,
  config.get('Application.secretKey'),
  { expiresIn: lifeTime }
);

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.get('Application.secretKey'));
  } catch (error) {
    if (error.name === 'TokenExpiredError') throwAppError(401, 'Expired token');
    else throwAppError(401, 'You are not authorized to perform this operation');
  }
};

module.exports = {
  generateAccessToken,
  verifyAccessToken
};

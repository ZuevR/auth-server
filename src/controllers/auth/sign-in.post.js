const { throwAppError } = require('../../helpers/error');
const router = require('express').Router();
const uuid = require('uuid/v4');
const { accessTokenLifeTimeS } = require('../../constants');
const { generateAccessToken } = require('../../helpers/perform-jwt');
const { User, Token } = require('../../models');
const { checkRequiredData, sanitizeFormData } = require('../../middleware');
const { status } = require('../../constants');

router.post(
  '/auth/sign-in',
  sanitizeFormData,
  checkRequiredData,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user || !user.comparePassword(password)) throwAppError(403, 'Wrong email or password');
      if (user.status === status.candidate) throwAppError(401, 'User not verified');
      const refreshToken = await Token.create({ body: uuid(), userId: user.id });
      res.json({
        token: generateAccessToken({ id: user.id }, accessTokenLifeTimeS),
        refreshToken: refreshToken.body
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

// ToDo: add the logic of Refresh Tokens creation together with the device from which the user logs in
// ToDo: in future use id of user's device to delete certain Refresh Token on logout

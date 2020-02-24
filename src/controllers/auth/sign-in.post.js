const { throwAppError } = require('../../helpers/error');
const router = require('express').Router();
const config = require('config');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
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
      const token = await Token.create({ body: uuid(), userId: user.id });
      res.json({
        token: jwt.sign({ id: user.id }, config.get('Application.secretKey')),
        refreshToken: token.body
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

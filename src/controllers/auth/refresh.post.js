const router = require('express').Router();
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const config = require('config');
const { Token } = require('../../models');
const { throwAppError } = require('../../helpers/error');

router.post(
  '/auth/refresh',
  async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      const token = await Token.findOne({
        where: { body: refreshToken }
      });
      if (!token) throwAppError(404, 'Token not exist');
      const newRefreshToken = uuid();
      await Token.update(
        { body: newRefreshToken },
        { where: { body: token.body, userId: token.userId } }
      );
      res.json({
        token: jwt.sign({ id: token.userId }, config.get('Application.secretKey')),
        refreshToken: newRefreshToken
      })
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

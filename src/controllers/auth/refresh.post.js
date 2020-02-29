const router = require('express').Router();
const uuid = require('uuid/v4');
const { generateAccessToken } = require('../../helpers/perform-jwt');
const { Token } = require('../../models');
const { accessTokenLifeTimeS } = require('../../constants');
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
        token: generateAccessToken({ id: token.userId }, accessTokenLifeTimeS),
        refreshToken: newRefreshToken
      })
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

const router = require('express').Router();
const { checkJwtAuthentication } = require('../../middleware/validators');
const { Token } = require('../../models');

router.post(
  '/auth/logout',
  checkJwtAuthentication,
  async (req, res, next) => {
    try {
      const refreshToken = req.body.rt;
      await Token.destroy({ where: { body: refreshToken } });
      res.json({ message: 'OK' });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

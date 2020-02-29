const router = require('express').Router();
const { User, Token } = require('../../models');
const { checkJwtAuthentication } = require('../../middleware/validators');

router.get(
  '/auth/logout-from-all',
  checkJwtAuthentication,
  async (req, res, next) => {
    try {
      const { id } = req.jwtData;
      await Token.destroy({ where: { userId: id } });
      res.json({ message: 'OK' });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

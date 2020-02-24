const router = require('express').Router();
const { User } = require('../../models');
const { throwAppError } = require('../../helpers/error');
const { verificationCodeLifeTimeMs, status } = require('../../constants');
const { checkCodeExpiration } = require('../../helpers/timer');

router.post(
  '/auth/confirm',
  async (req, res, next) => {
    try {
      const { confirmationCode, userId } = req.body;
      const user = await User.findByPk(userId);
      const { verificationCode, updatedAt } = user;
      if (verificationCode !== +confirmationCode || checkCodeExpiration(updatedAt, verificationCodeLifeTimeMs)) {
        throwAppError(400, 'The code is wrong or has expired');
      }
      await user.update({ status: status.user });
      res.json({ msg: 'ok' })
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

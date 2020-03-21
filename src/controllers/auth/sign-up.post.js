const router = require('express').Router();
const { sendVerificationEmail } = require('../../helpers/email');
const { sanitizeFormData } = require('../../middleware/sanitizer');
const { User } = require('../../models');

router.post(
  '/auth/sign-up',
  sanitizeFormData,
  async (req, res, next) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      const user = await User.create({ firstName, lastName, email, password });
      await sendVerificationEmail(user.email, user.verificationCode, user.firstName);
      user.removeSecretFields();
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

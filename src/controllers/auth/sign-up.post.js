const router = require('express').Router();
const { sanitizeFormData } = require('../../middleware/sanitizer');
const { User } = require('../../models');

router.post(
  '/auth/sign-up',
  sanitizeFormData,
  async (req, res, next) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      const user = await User.create({ firstName, lastName, email, password });
      user.removeSecretFields();
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

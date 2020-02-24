const sanitizeFormData = (req, res, next) => {
  if (req.body.firstName) req.body.firstName = req.body.firstName.trim();
  if (req.body.lastName) req.body.lastName = req.body.lastName.trim();
  if (req.body.email) req.body.email = req.body.email.trim().toLowerCase();
  if (req.body.password) req.body.password = req.body.password.trim();
  next();
};

module.exports = { sanitizeFormData };

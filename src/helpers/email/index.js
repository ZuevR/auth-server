const nodemailer = require('nodemailer');
const config = require('config');
const { generateVerificationEmail } = require('./email');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: config.get('Email.login'),
    pass: config.get('Email.password')
  }
});

const sendVerificationEmail = async (email, code, name) => {
  let info = await transporter.sendMail({
    from: '"My Application 👻" <foo@example.com>',
    to: email,
    subject: 'Verification email ✔',
    text: 'Hello world?',
    html: generateVerificationEmail(name, code)
  });

  console.log('Message sent: %s', info.messageId);
};

module.exports = { sendVerificationEmail };

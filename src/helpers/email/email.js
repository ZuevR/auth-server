const generateVerificationEmail = (userName, code) => (`
  <div style="background: lightgray; padding: 25px">
    <h1 style="text-align: center">Hello, ${userName}</h1>
    <p>Your verification code: <strong style="text-decoration: underline">${code}</strong></p>
  </div>
`);

module.exports = { generateVerificationEmail };

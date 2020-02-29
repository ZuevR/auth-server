const verificationCodeLifeTimeMs = 180000;
const accessTokenLifeTimeS = 300;

const status = {
  candidate: 0,
  user: 1,
};

module.exports = {
  verificationCodeLifeTimeMs,
  accessTokenLifeTimeS,
  status
};

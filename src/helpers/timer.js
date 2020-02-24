const checkCodeExpiration = (creationTime, limit) => {
  return Date.now() - new Date(creationTime).getTime() > limit;
};

module.exports = {
  checkCodeExpiration
};

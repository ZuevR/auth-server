'use strict';

module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define('Token', {
    body: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE
    },
    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE
    }
  }, {
    tableName: 'tokens',
    timestamps: false
  });

  Token.associate = function (models) {
    Token.belongsTo(models.User, { foreignKey: 'userId', as: 'token' });
  };

  Token.removeTheOldestToken = async function (userId, limitNumberOfTokens) {
    const allUserTokens = await Token.findAndCountAll({ where: { userId } });
    if (allUserTokens.count >= limitNumberOfTokens) {
      const tokenDates = allUserTokens.rows.map(item => ({
        body: item.body,
        time: new Date(item.createdAt).getTime()
      }));
      const oldestToken = tokenDates.reduce((acc, cur) => cur.time < acc.time ? cur : acc);
      await Token.destroy({ where: { body: oldestToken.body } });
    }
  };

  return Token;
};

'use strict';

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      field: 'first_name',
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: { msg: 'First name field is required' } }
    },
    lastName: {
      field: 'last_name',
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: { msg: 'Last name field is required' } }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Email field is required' },
        isEmail: { msg: 'Email must be a valid email address' },
        async isUnique(value, next) {
          const email = await User.findOne({ where: { email: value } });
          if (email) next(`User with ${value} email address already exist`);
          next();
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: { msg: 'Password field is required' } }
    },
    verificationCode: {
      field: 'verification_code',
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.SMALLINT
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
    timestamps: false,
    tableName: 'users'
  });

  User.associate = function (models) {
    User.hasMany(models.Token, { foreignKey: 'userId', as: 'tokens' });
  };

  User.beforeValidate(function (model) {
    return model.generateVerificationCode();
  });

  User.beforeCreate('generatePasswordHash', (user) => {
    return bcrypt.hash(user.password, 3).then(hashedPwd => user.password = hashedPwd);
  });

  User.prototype.generateVerificationCode = function () {
    this.verificationCode = Math.floor(100000 + Math.random() * 900000);
  };

  User.prototype.removeSecretFields = function () {
    delete this.dataValues.password;
    delete this.dataValues.verificationCode;
  };

  User.prototype.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  return User;
};

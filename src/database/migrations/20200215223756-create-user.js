'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        field: 'first_name',
        type: Sequelize.STRING(45),
        allowNull: false
      },
      lastName: {
        field: 'last_name',
        type: Sequelize.STRING(45),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(60),
        unique: true,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING(60),
        allowNull: false
      },
      verificationCode: {
        field: 'verification_code',
        allowNull: false,
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.SMALLINT,
        defaultValue: 0
      },
      createdAt: {
        field: 'created_at',
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        field: 'updated_at',
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};

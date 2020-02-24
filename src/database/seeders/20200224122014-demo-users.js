'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        first_name: 'John',
        last_name: 'Doe',
        email: 'johndoe@mail.com',
        password: bcrypt.hashSync('password_1', 3),
        verification_code: 111111,
        status: 1,
        created_at: '2020-01-01 12:00:00.000000',
        updated_at: '2020-01-01 12:00:00.000000'

      },
      {
        first_name: 'User',
        last_name: 'Second',
        email: 'usersecond@mail.com',
        password: bcrypt.hashSync('password_2', 3),
        verification_code: 222222,
        status: 0,
        created_at: new Date(),
        updated_at: new Date()

      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};

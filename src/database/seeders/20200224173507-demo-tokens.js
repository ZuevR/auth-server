'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('tokens', [
      {
        body: '3a2d2d37-118f-4d68-bad5-07a7eaf729fd',
        userId: 1,
        created_at: '2020-02-24 12:00:00.000000',
        updated_at: '2020-02-24 12:00:00.000000'
      },
      {
        body: 'd0b30b81-8c9f-4ffe-8a98-35b815a4238d',
        userId: 2,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tokens', null, {});
  }
};

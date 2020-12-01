'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('Lists', [
      {name: 'Inbox', userId: 6, createdAt: new Date(), updatedAt: new Date()},
      {name: 'Inbox', userId: 7, createdAt: new Date(), updatedAt: new Date()},
      {name: 'Inbox', userId: 8, createdAt: new Date(), updatedAt: new Date()},
      {name: 'Inbox', userId: 9, createdAt: new Date(), updatedAt: new Date()},
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('Lists', null, {});
  }
};

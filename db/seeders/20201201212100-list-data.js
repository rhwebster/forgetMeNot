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
      {name: 'Inbox', userId: 1, createdAt: new Date(), updatedAt: new Date()},
      {name: 'Inbox', userId: 2, createdAt: new Date(), updatedAt: new Date()},
      {name: 'Inbox', userId: 3, createdAt: new Date(), updatedAt: new Date()},
      {name: 'Inbox', userId: 4, createdAt: new Date(), updatedAt: new Date()},
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

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
    return queryInterface.bulkInsert('Tasks', [
      {
        name: 'Garbage',
        userId: 6,
        listId: 9,
        // due: Date('2020-12-25'),
        completed: false, createdAt: new Date(), updatedAt: new Date()
      },
      {
        name: 'Dishes',
        notes: "There are a lot of dishes, please clean them",
        userId: 7,
        listId: 10,
        // due: Date('2020-12-24'),
        completed: false, createdAt: new Date(), updatedAt: new Date()
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('Tasks', null, {});
  }
};

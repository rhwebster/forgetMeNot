'use strict';
const db = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    const lists = await db.List.findAll({
      order: [['id']]
    });
    return queryInterface.bulkInsert('Tasks', [
      {
        name: 'Garbage',
        userId: lists[0].userId,
        listId: lists[0].id,
        // due: Date('2020-12-25'),
        completed: false, createdAt: new Date(), updatedAt: new Date()
      },
      {
        name: 'Dishes',
        notes: "There are a lot of dishes, please clean them",
        userId: lists[1].userId,
        listId: lists[1].id,
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

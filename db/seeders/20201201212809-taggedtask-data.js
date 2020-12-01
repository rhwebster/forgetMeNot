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
    const tasks = await db.Task.findAll({
      order: [['id']]
    });
    const tags = await db.Tag.findAll({
      order: [['id']]
    });
    return queryInterface.bulkInsert('TaggedTasks', [
      {taskId: tasks[0].id, tagId: tags[0].id, createdAt: new Date(), updatedAt: new Date()},
      {taskId: tasks[1].id, tagId: tags[0].id, createdAt: new Date(), updatedAt: new Date()},
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('TaggedTasks', null, {});
  }
};

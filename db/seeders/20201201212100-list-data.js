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
    const userIds = [];
    const emails = ['clark@kent.com', 'bug@barney.com', 'daffy@duck.com', 'porky@pig.com'];
    for(let i = 0; i < 4; i++){
      let user = await db.User.findOne({
        where: {
          email: emails[i]
        }
      });
      userIds.push(user.id);
    }
    return queryInterface.bulkInsert('Lists', [
      {name: 'Inbox', userId: userIds[0], createdAt: new Date(), updatedAt: new Date()},
      {name: 'Inbox', userId: userIds[1], createdAt: new Date(), updatedAt: new Date()},
      {name: 'Inbox', userId: userIds[2], createdAt: new Date(), updatedAt: new Date()},
      {name: 'Inbox', userId: userIds[3], createdAt: new Date(), updatedAt: new Date()},
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

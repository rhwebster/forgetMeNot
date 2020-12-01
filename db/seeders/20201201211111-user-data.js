'use strict';
const bcrypt = require('bcryptjs');

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
    return queryInterface.bulkInsert('Users', [
      {email: 'clark@kent.com', firstName: 'Clark', lastName: 'Kent', hashedPassword: await bcrypt.hash('password1', 10), createdAt: new Date(), updatedAt: new Date()},
      {email: 'bug@barney.com', firstName: 'Bug', lastName: 'Barney', hashedPassword: await bcrypt.hash('password2', 10), createdAt: new Date(), updatedAt: new Date()},
      {email: 'daffy@duck.com', firstName: 'Daffy', lastName: 'Duck', hashedPassword: await bcrypt.hash('password3', 10), createdAt: new Date(), updatedAt: new Date()},
      {email: 'porky@pig.com', firstName: 'Porky', lastName: 'Pig', hashedPassword: await bcrypt.hash('password4', 10), createdAt: new Date(), updatedAt: new Date()},
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('Users', null, {});
  }
};

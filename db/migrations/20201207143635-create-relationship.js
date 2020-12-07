'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Relationships',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        user1Id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Users",
            key: 'id'
          }
        },
        user2Id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Users",
            key: 'id'
          }
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        lastActionUserId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Users",
            key: 'id'
          }
        },
        user1Role: {
          type: Sequelize.STRING(50)
        },
        user2Role: {
          type: Sequelize.STRING(50)
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
      },
      {
        uniqueKeys: {
          Items_unique: {
            fields: ['user1Id', 'user2Id']
          }
        }
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Relationships');
  }
};
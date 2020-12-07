'use strict';
module.exports = (sequelize, DataTypes) => {
  const Relationship = sequelize.define('Relationship',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      user1Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: 'id'
        }
      },
      user2Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: 'id'
        }
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      lastActionUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: 'id'
        }
      },
      user1Role: {
        type: DataTypes.STRING(50)
      },
      user2Role: {
        type: DataTypes.STRING(50)
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
    },
    {
      uniqueKeys: {
        Items_unique: {
          fields: ['user1Id', 'user2Id']
        }
      }
    });
  Relationship.associate = function (models) {
    // associations can be defined here
    // Relationship.hasMany()
  };
  return Relationship;
};
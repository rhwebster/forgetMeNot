'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    listId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    due: {
      type: DataTypes.DATE,
    },
    completed: DataTypes.BOOLEAN
  }, {});
  Task.associate = function(models) {
    Task.belongsTo(models.List, { foreignKey: 'listId'});
    Task.belongsTo(models.User, { foreignKey: 'userId' });
    Task.belongsToMany(models.Tag, { through: "TaggedTask", foreignKey: "taskId", otherKey: "tagId", as: "TasksWithTags"})
  };
  return Task;
};
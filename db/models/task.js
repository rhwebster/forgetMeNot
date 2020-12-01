'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    name: DataTypes.STRING,
    notes: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    listId: DataTypes.INTEGER,
    due: DataTypes.STRING,
    completed: DataTypes.BOOLEAN
  }, {});
  Task.associate = function(models) {
    // associations can be defined here
  };
  return Task;
};
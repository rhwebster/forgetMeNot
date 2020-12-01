'use strict';
module.exports = (sequelize, DataTypes) => {
  const TaggedTask = sequelize.define('TaggedTask', {
    taskId: DataTypes.INTEGER,
    tagId: DataTypes.INTEGER
  }, {});
  TaggedTask.associate = function(models) {
    // associations can be defined here
  };
  return TaggedTask;
};
"use strict";
module.exports = (sequelize, DataTypes) => {
  const TaggedTask = sequelize.define(
    "TaggedTask",
    {
      taskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tagId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {}
  );
  TaggedTask.associate = function (models) {
    // associations can be defined here
  };
  return TaggedTask;
};

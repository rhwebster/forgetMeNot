'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    }
  }, {});
  Tag.associate = function(models) {
    // associations can be defined here
    Tag.belongsToMany(models.Task, { through: "TaggedTask", foreignKey: "tagId", otherKey: "taskId", as: "tagwithtasks"});
  };
  return Tag;
};
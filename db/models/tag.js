'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {});
  Tag.associate = function(models) {
    // associations can be defined here
    Tag.belongsTo(models.TaggedTask, { foreignKey: "tagId"});
  };
  return Tag;
};
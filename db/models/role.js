'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    }
  }, {});
  Role.associate = function(models) {
    // associations can be defined here
  };
  return Role;
};
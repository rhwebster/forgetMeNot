"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      firstName: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        unique: true,
      },
    },
    {}
  );
  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.Task, { foreignKey: "userId" });
    User.hasMany(models.List, { foreignKey: "userId" });
  };
  return User;
};

const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/sequerize");


const Users = sequelize.define(
  "Users", {
  name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
  },
});

module.exports = Users;
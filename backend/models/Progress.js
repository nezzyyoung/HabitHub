const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/sequerize");

const Progress = sequelize.define(
  "Progress", {
  habitId: {
    type: DataTypes.STRING, // Update this to match the data type of the id column in the Habit table
  },
  userId: {
    type: DataTypes.INTEGER,
  },
  date: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.ENUM('completed', 'missed'),
  },
});

module.exports = Progress;
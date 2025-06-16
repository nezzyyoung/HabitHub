const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/sequerize");


const Habit = sequelize.define(
  "Habit", {
  name: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  frequency: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly'),
  },
  startDate: {
    type: DataTypes.DATE,
  },
  endDate: {
    type: DataTypes.DATE,
  },
  userId: {
    type: DataTypes.INTEGER, // Update this to match the data type of the habitId column in the Progresses table
  },
  goalId: {
    type: DataTypes.INTEGER,
  },
});

module.exports = Habit;
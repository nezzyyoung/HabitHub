const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/sequerize");

const Goal = sequelize.define(
  "Goal",  {
  title: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  startDate: {
    type: DataTypes.DATE,
  },
  endDate: {
    type: DataTypes.DATE,
  },
  userId: {
    type: DataTypes.STRING, // Update this to match the data type of the id column in the User table
  },
}, 
{
  timestamps: true,
}
);

module.exports = Goal;
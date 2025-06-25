const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/sequerize");
const bcrypt = require('bcrypt');

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
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance method to validate password
Users.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = Users;

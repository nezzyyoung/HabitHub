// models/index.js
const sequelize = require('../utils/sequerize');
const Users = require('./Users');


// Exportez tous les modèles
const db_async = {
  sequelize,
  Users
  
};

module.exports = db_async;
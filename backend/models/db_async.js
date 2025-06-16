// models/index.js
const sequelize = require('../utils/sequerize');
const Users = require('./Users');
const Goal = require('./Goal');
const Habit = require('./Habit');
const Progress = require('./Progress');


// Exportez tous les modèles
const db_async = {
  sequelize,
  Users,
  Goal,
  Habit,
  Progress,

  
};

module.exports = db_async;
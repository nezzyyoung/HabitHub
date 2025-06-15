const express = require('express')
const marchantRouter = require('./marchantRouter');
const marchantRouterProvider = express.Router();

marchantRouterProvider.use('/users', marchantRouter)

module.exports = marchantRouterProvider

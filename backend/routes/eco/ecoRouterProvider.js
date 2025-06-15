const express = require('express');
const ecoRouter = require('./ecoRouter');
const ecoRouterProvider = express.Router();

ecoRouterProvider.use('/users', ecoRouter)

module.exports = ecoRouterProvider
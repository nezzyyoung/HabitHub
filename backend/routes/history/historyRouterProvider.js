const express = require('express');
const historyRouter = require('./historyRouter');
const historyRouterProvider = express.Router();

historyRouterProvider.use('/users', historyRouter)

module.exports = historyRouterProvider
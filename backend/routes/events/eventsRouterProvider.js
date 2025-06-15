const express = require('express');
const eventsRouter = require('./eventsRouter');
const eventsRouterProvider = express.Router();

eventsRouterProvider.use('/users', eventsRouter)

module.exports = eventsRouterProvider
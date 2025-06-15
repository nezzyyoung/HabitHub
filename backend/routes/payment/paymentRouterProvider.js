const express = require('express');
const paymentRouter = require('./paymentRouter');
const paymentRouterProvider = express.Router();

paymentRouterProvider.use('/users', paymentRouter)

module.exports = paymentRouterProvider
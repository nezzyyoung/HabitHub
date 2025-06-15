const express = require('express')
const authRouter = require('./authRouter');
const authRouterProvider = express.Router();

authRouterProvider.use('/users', authRouter)

module.exports = authRouterProvider

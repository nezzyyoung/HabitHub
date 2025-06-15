const express = require('express');
const postsRouter = require('./postsRouter');
const adminsRouter = require('../admins/adminsRouter');
const postsRouterProvider = express.Router();

postsRouterProvider.use('/', postsRouter);
postsRouterProvider.use('/admins', adminsRouter);

module.exports = postsRouterProvider;

const express = require('express')
const authController = require('../../controllers/auth/auth.controllers')
const authRouter = express.Router()

authRouter.post('/client/login', authController.loginUsers);
authRouter.post('/client/create', authController.createUsers);

authRouter.post('/marchant/login', authController.loginUsersMarchant);
authRouter.post('/marchant/create', authController.createUsersMarchant);

module.exports = authRouter;
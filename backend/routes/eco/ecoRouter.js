const express = require('express');
const { getEcoPoints, transferEcoPoints, getUserByPhoneNumber } = require('../../controllers/eco/eco');
const ecoRouter = express.Router();

ecoRouter.get('/display', getEcoPoints);
ecoRouter.post('/transfer', transferEcoPoints);
ecoRouter.get('/user/:phoneNumber', getUserByPhoneNumber);

module.exports = ecoRouter;

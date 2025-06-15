const express = require('express');
const adminsController = require('../../controllers/admins/admins.controller');
const adminsRouter = express.Router();

adminsRouter.get('/', adminsController.getBusinessesBySector);
adminsRouter.get('/:id', adminsController.getBusinessById);

module.exports = adminsRouter;

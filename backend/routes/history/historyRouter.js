const express = require('express');
const historyController = require('../../controllers/history/history.controller');
const historyRouter = express.Router()

historyRouter.get('/payment/client', historyController.getHistoryClient);
historyRouter.get('/payment/client/ecos', historyController.getHistoryClientEcos);
historyRouter.get('/ecos/recus', historyController.getHistoryEcos);
historyRouter.get('/payment/business', historyController.getHistoryBusinessTransactions);

module.exports = historyRouter;

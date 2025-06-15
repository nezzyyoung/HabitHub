const express = require('express');
const payment_controller = require('../../controllers/payment/payment.controllers');
const requireAuth = require('../../middleware/requireAuth');
const paymentRouter = express.Router()

paymentRouter.post('/product', requireAuth, payment_controller.paymentProduct);
paymentRouter.get('/all/typewallet', payment_controller.getAllTypeWallet);
paymentRouter.get('/all/money/wallet/:id_type_wallet', payment_controller.getMoneyWallet);
paymentRouter.post('/cash/product', requireAuth, payment_controller.paymentCashProduct);
paymentRouter.get('/history', requireAuth, payment_controller.getExpenditureHistory);

paymentRouter.post('/marchant/product/cash', requireAuth, payment_controller.marchantProductCash);

module.exports = paymentRouter;
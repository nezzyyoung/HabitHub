const express = require('express');
const eventsController = require('../../controllers/events/events.controller');
const eventsRouter = express.Router()

eventsRouter.post('/publicite/create', eventsController.createEvents);
eventsRouter.get('/publicite/getall', eventsController.getAllEventsClient);

module.exports = eventsRouter;
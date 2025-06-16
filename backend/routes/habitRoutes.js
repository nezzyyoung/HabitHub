const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');

router.post('/', habitController.createHabit);
router.get('/:userId', habitController.getHabits);
router.get('/:id', habitController.getHabit);
router.put('/:id', habitController.updateHabit);
router.delete('/:id', habitController.deleteHabit);

module.exports = router;
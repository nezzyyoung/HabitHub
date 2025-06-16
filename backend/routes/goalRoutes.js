const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');

router.post('/', goalController.createGoal);
router.get('/:userId', goalController.getGoals);
router.get('/:id', goalController.getGoal);
router.put('/:id', goalController.updateGoal);
router.delete('/:id', goalController.deleteGoal);

module.exports = router;
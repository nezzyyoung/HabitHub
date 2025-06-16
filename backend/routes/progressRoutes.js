const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');

router.post('/', progressController.createProgress);
router.get('/:habitId/:userId', progressController.getProgress);
router.put('/:id', progressController.updateProgress);
router.delete('/:id', progressController.deleteProgress);

module.exports = router;
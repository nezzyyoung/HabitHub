const Progress = require('../models/Progress');
const Habit = require('../models/Habit');
const User = require('../models/Users');

exports.createProgress = async (req, res) => {
  try {
    const progress = await Progress.create(req.body);
    res.json(progress);
  } catch (err) {
    res.status(400).json({ message: 'Error creating progress' });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const progress = await Progress.findAll({
      where: { habitId: req.params.habitId, userId: req.params.userId },
    });
    res.json(progress);
  } catch (err) {
    res.status(404).json({ message: 'Progress not found' });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const progress = await Progress.update(req.body, {
      where: { id: req.params.id },
    });
    res.json(progress);
  } catch (err) {
    res.status(400).json({ message: 'Error updating progress' });
  }
};

exports.deleteProgress = async (req, res) => {
  try {
    await Progress.destroy({
      where: { id: req.params.id },
    });
    res.json({ message: 'Progress deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting progress' });
  }
};
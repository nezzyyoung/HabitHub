const Goal = require('../models/Goal');
const User = require('../models/Users');

exports.createGoal = async (req, res) => {
  try {
    const goal = await Goal.create(req.body);
    res.json(goal);
  } catch (err) {
    res.status(400).json({ message: 'Error creating goal' });
  }
};

exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.findAll({
      where: { userId: req.params.userId },
    });
    res.json(goals);
  } catch (err) {
    res.status(404).json({ message: 'Goals not found' });
  }
};

exports.getGoal = async (req, res) => {
  try {
    const goal = await Goal.findByPk(req.params.id);
    res.json(goal);
  } catch (err) {
    res.status(404).json({ message: 'Goal not found' });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const goal = await Goal.update(req.body, {
      where: { id: req.params.id },
    });
    res.json(goal);
  } catch (err) {
    res.status(400).json({ message: 'Error updating goal' });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    await Goal.destroy({
      where: { id: req.params.id },
    });
    res.json({ message: 'Goal deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting goal' });
  }
};
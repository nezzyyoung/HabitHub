const Habit = require('../models/Habit');
const User = require('../models/Users');
const Goal = require('../models/Goal');

exports.createHabit = async (req, res) => {
  try {
    const habit = await Habit.create(req.body);
    res.json(habit);
  } catch (err) {
    res.status(400).json({ message: 'Error creating habit' });
  }
};

exports.getHabits = async (req, res) => {
  try {
    const habits = await Habit.findAll({
      where: { userId: req.params.userId },
    });
    res.json(habits);
  } catch (err) {
    res.status(404).json({ message: 'Habits not found' });
  }
};

exports.getHabit = async (req, res) => {
  try {
    const habit = await Habit.findByPk(req.params.id);
    res.json(habit);
  } catch (err) {
    res.status(404).json({ message: 'Habit not found' });
  }
};

exports.updateHabit = async (req, res) => {
  try {
    const habit = await Habit.update(req.body, {
      where: { id: req.params.id },
    });
    res.json(habit);
  } catch (err) {
    res.status(400).json({ message: 'Error updating habit' });
  }
};

exports.deleteHabit = async (req, res) => {
  try {
    await Habit.destroy({
      where: { id: req.params.id },
    });
    res.json({ message: 'Habit deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting habit' });
  }
};
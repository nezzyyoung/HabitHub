const express = require('express');
const router = express.Router();
const RESPONSE_CODES = require('../constants/RESPONSE_CODES.js');
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS.js');
const db_async = require('../models/db_async');
const jwt = require('jsonwebtoken');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await db_async.sequelize.models.User.create({ name, email, password });
    res.json(response(RESPONSE_CODES.CREATED, RESPONSE_STATUS.SUCCESS, 'User created successfully', user));
  } catch (err) {
    res.status(400).json(response(RESPONSE_CODES.INTERNAL_SERVER_ERROR, RESPONSE_STATUS.ERROR, 'Error creating user', null));
  }
});

// Login a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db_async.sequelize.models.User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json(response(RESPONSE_CODES.UNAUTHORIZED, RESPONSE_STATUS.ERROR, 'Invalid email or password', null));
    }
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json(response(RESPONSE_CODES.UNAUTHORIZED, RESPONSE_STATUS.ERROR, 'Invalid email or password', null));
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    res.json(response(RESPONSE_CODES.OK, RESPONSE_STATUS.SUCCESS, 'Logged in successfully', { token }));
  } catch (err) {
    res.status(400).json(response(RESPONSE_CODES.INTERNAL_SERVER_ERROR, RESPONSE_STATUS.ERROR, 'Error logging in', null));
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const RESPONSE_CODES = require('../constants/RESPONSE_CODES.js');
const RESPONSE_STATUS = require('../constants/RESPONSE_STATUS.js');
const db_async = require('../models/db_async');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db_async.Users.create({ name, email, password: hashedPassword });
    res.status(RESPONSE_CODES.CREATED).json({
      statusCode: RESPONSE_CODES.CREATED,
      httpStatus: RESPONSE_STATUS.SUCCESS,
      message: 'User created successfully',
      result: user,
    });
  } catch (err) {
    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      httpStatus: RESPONSE_STATUS.ERROR,
      message: 'Error creating user',
      result: null,
    });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db_async.Users.findOne({ where: { email } });
    if (!user) {
      return res.status(RESPONSE_CODES.UNAUTHORIZED).json({
        statusCode: RESPONSE_CODES.UNAUTHORIZED,
        httpStatus: RESPONSE_STATUS.ERROR,
        message: 'Invalid email or password',
        result: null,
      });
    }
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(RESPONSE_CODES.UNAUTHORIZED).json({
        statusCode: RESPONSE_CODES.UNAUTHORIZED,
        httpStatus: RESPONSE_STATUS.ERROR,
        message: 'Invalid email or password',
        result: null,
      });
    }
const token = jwt.sign({ id: user.id }, process.env.JWT_PRIVATE_KEY || 'your_jwt_secret', { expiresIn: '1h' });
    res.status(RESPONSE_CODES.OK).json({
      statusCode: RESPONSE_CODES.OK,
      httpStatus: RESPONSE_STATUS.SUCCESS,
      message: 'Logged in successfully',
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
      statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
      httpStatus: RESPONSE_STATUS.ERROR,
      message: 'Error logging in',
      result: null,
    });
  }
});

module.exports = router;

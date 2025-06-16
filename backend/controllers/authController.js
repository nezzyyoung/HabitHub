const express = require('express');
const router = express.Router();
const db = require('../db'); // assuming you have a db.js file with your MySQL connection
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await db.execute('INSERT INTO users SET ?', { name, email, password: hashedPassword });
  res.json({ message: 'User registered successfully' });
});

// Login an existing user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Other authentication-related routes...

module.exports = router;
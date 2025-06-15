require('dotenv').config();
const sequelize = require('./utils/sequerize');
const db_async = require('./models/db_async');
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 4000;

// MySQL connection configuration
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'test'
});

// Connect to MySQL
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Middleware to parse JSON bodies
app.use(express.json());

// Example route to get all records from senovara table
app.get('/habithub', (req, res) => {
  connection.query('SELECT * FROM senovara', (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'Database query error' });
      return;
    }
    res.json(results);
  });
});

// Start the server
const ip = require('ip');

app.listen(port, async () => {
  await db_async.sequelize.sync({ force: true }); 
  console.log(
    `${process.env.NODE_ENV ? process.env.NODE_ENV.toUpperCase() : 'DEV'} - Server is running on: http://${ip.address()}:${port}/`
  );
});

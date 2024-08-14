const express = require('express');
const app = express();
const mysql = require('mysql');
const bcrypt = require('bcrypt');

// Database connection settings
const db = mysql.createConnection({
  host: 'your_host',
  user: 'your_user',
  password: 'your_password',
  database: 'your_database'
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('error connecting:', err);
    return;
  }
  console.log('connected as id ' + db.threadId);
});

// Middleware to parse JSON bodies
app.use(express.json());

// API endpoint for login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = ?`;
  db.query(query, [username], (err, results) => {
    if (err) {
      res.status(500).send({ message: 'Error logging in' });
    } else if (results.length > 0) {
      const user = results[0];
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (isValidPassword) {
        res.send({ message: 'Login successful' });
      } else {
        res.status(401).send({ message: 'Invalid username or password' });
      }
    } else {
      res.status(401).send({ message: 'Invalid username or password' });
    }
  });
});

// API endpoint for notifications
app.get('/api/notifications', (req, res) => {
  const query = `SELECT * FROM comments WHERE parent_id IS NOT NULL AND user_id = ?`;
  db.query(query, [req.query.user_id], (err, results) => {
    if (err) {
      res.status(500).send({ message: 'Error fetching notifications' });
    } else {
      res.send(results);
    }
  });
});

// API endpoint for About section
app.get('/api/about', (req, res) => {
  const query = `SELECT * FROM about_content`; // Replace with your actual query
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send({ message: 'Error fetching About content' });
    } else {
      res.send(results[0]); // Assuming one row of content
    }
  });
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
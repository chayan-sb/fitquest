const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Shiv@7353',
  database: 'fitness_db',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    throw err;
  }
  console.log('Connected to MySQL database');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Query the database to check user credentials
  db.query(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error authenticating user' });
        throw err;
      }

      if (results.length === 1) {
        // Successful login
        res.status(200).json({ success: true, message: 'Login successful' });
      } else {
        // Invalid credentials
        res.status(401).json({ success: false, error: 'Invalid username or password' });
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

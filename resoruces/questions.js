const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors')

const app = express();
const port = 5500;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Shiv@7353',
  database: 'fitness_db',
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

app.post('/submit', (req, res) => {
  const {
    age,
    gender,
    bmi,
    exercise_time,
    exercise_type,
    focus_area,
    medical_conditions,
    fitness_goals,
    additional_comments,
  } = req.body;

  const insertData = {
    age,
    gender,
    bmi,
    exercise_time,
    exercise_type,
    focus_area,
    medical_conditions,
    fitness_goals,
    additional_comments,
  };

  db.query('INSERT INTO fitness_data SET ?', insertData, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error storing data' });
      throw err;
    }
    res.status(200).json({ message: 'Data stored successfully' });
  });
});
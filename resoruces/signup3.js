const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const mysql = require('mysql2');
const cors = require('cors'); // Import the cors package

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use cors middleware with permissive configuration
app.use(cors());

// Create a connection to your MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Shiv@7353', // Replace with your MySQL password
  database: 'fitness_db',
});

const dataFilePath = 'signup2.json';

// Handle POST requests to '/signup'
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;

  // Read existing data from the file
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data file:', err);
      res.status(500).json({ error: 'Error reading data file' });
      return;
    }

    let jsonData = JSON.parse(data || '[]'); // Initialize as an empty array if the file is empty

    // Add new data to the array
    jsonData.push({ username, email, password });

    // Write the updated data back to the file
    fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error('Error writing data file:', err);
        res.status(500).json({ error: 'Error writing data file' });
        return;
      }

      // Insert data into the MySQL database
      const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      const values = [username, email, password];

      db.query(sql, values, (err, result) => {
        if (err) {
          console.error('Error inserting data into the database:', err);
          res.status(500).json({ error: 'Error inserting data' });
          return;
        }
        console.log('Data inserted successfully');
        res.status(200).json({ message: 'Data received and saved successfully' });
      });
    });
  });
});


app.get('/data', (req, res) => {
  // Read data from the file and respond with it
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data file:', err);
      res.status(500).json({ error: 'Error reading data file' });
      return;
    }

    const jsonData = JSON.parse(data || '[]'); // Initialize as an empty array if the file is empty
    res.status(200).json(jsonData);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//this is event1.js
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// POST endpoint to handle form submissions
app.post('/register', (req, res) => {
  const formData = req.body;

  // Read existing data (if any)
  let registrations = [];
  try {
    const data = fs.readFileSync('registrations.json', 'utf-8');
    registrations = JSON.parse(data);
  } catch (error) {
    console.error(error);
  }

  // Add new registration data
  registrations.push(formData);

  // Write the updated data back to the JSON file
  fs.writeFileSync('registrations.json', JSON.stringify(registrations, null, 2));

  res.status(200).send('Registration successful');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

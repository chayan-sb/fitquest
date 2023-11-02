const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;
const articlesFilePath = 'blog/articles.json';
const usersFilePath= 'user.json';
let loggedInUser = null;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '/public'));

// Create a connection to your MySQL database
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





//login.js
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
        loggedInUser = username;
        res.status(200).json({ success: true, message: 'Login successful' });
      } else {
        // Invalid credentials
        res.status(401).json({ success: false, error: 'Invalid username or password' });
      }
    }
  );
});
// login.js ends..
//logout///
app.post('/logout', (req, res) => {
  loggedInUser = null; // Set the logged-in user to null
  console.log(loggedInUser);
  res.status(200).json({ success: true, message: 'Logout successful' });
});

//logout ends..

//signup.js


app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;

  // Insert data directly into the MySQL database
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

//signup.js ends


//event.js
app.post('/register', (req, res) => {
  const formData = req.body;

  // Define the SQL query to insert data into the database table
  const sql = 'INSERT INTO registrations (name, email, ticket_type, comments) VALUES (?, ?, ?, ?)';

  // Extract values from the formData object to insert into the database
  const values = [formData.name, formData.email, formData['ticket-type'], formData.comments];

  // Execute the SQL query to insert data
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting data into the database:', err);
      res.status(500).json({ error: 'Error storing data' });
      return;
    }
    console.log('Data inserted successfully');
    res.status(200).send('Registration successful');
  });
});
//event.js ends...




//workout.js starts....
// async function filterExercises(bodyPart, equipment, target) {
//   try {
//       const apiKey = 'ab92245281msh2a49594b99abe1ap1c0686jsn299a422ec561';
//       const host = 'exercisedb.p.rapidapi.com';

//       const options = {
//           method: 'GET',
//           url: 'https://exercisedb.p.rapidapi.com/exercises',
//           params: {
//               bodyPart,
//               equipment,
//               target
//           },
//           headers: {
//               'X-RapidAPI-Key': apiKey,
//               'X-RapidAPI-Host': host
//           }
//       };

//       const response = await axios.request(options);
//       return response.data;
//   } catch (error) {
//       console.error('Error fetching exercise data:', error);
//       throw error;
//   }
// }

// app.get('/getExercises', async (req, res) => {
//   try {
//       const { bodyPart, equipment, target } = req.query;
//       const filteredExercises = await filterExercises(bodyPart, equipment, target);
//       res.json(filteredExercises);
//   } catch (error) {
//       console.error('Error:', error);
//       res.status(500).json({ error: 'Error fetching exercise data' });
//   }
// });

// app.post('/filter-exercises', async (req, res) => {
//   try {
//       const { bodyPartInput, equipmentInput, targetInput } = req.body;
//       const filteredExercises = await filterExercises(bodyPartInput, equipmentInput, targetInput);
//       res.json(filteredExercises);
//   } catch (error) {
//       console.error('Error:', error);
//       res.status(500).json({ error: 'Error filtering exercises' });
//   }
// });

async function getAllExercises() {
  try {
      const apiKey = 'ab92245281msh2a49594b99abe1ap1c0686jsn299a422ec561';
      const host = 'exercisedb.p.rapidapi.com';

      const options = {
          method: 'GET',
          url: 'https://exercisedb.p.rapidapi.com/exercises?limit=1300',
          headers: {
              'X-RapidAPI-Key': apiKey,
              'X-RapidAPI-Host': host
          }
      };

      const response = await axios.request(options);
      return response.data;
  } catch (error) {
      console.error('Error fetching exercise data:', error);
      throw error;
  }
}

app.get('/getExercises', async (req, res) => {
  try {
      const allExercises = await getAllExercises();
      res.json(allExercises);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error fetching exercise data' });
  }
});

// workout.js ends...
//blogs.js
app.get('/articles', (req, res) => {
  try {
    const articles = JSON.parse(fs.readFileSync(articlesFilePath));
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/articles', (req, res) => {
  try {
    const articles = JSON.parse(fs.readFileSync(articlesFilePath));
    const newArticle = req.body;
    articles.push(newArticle);
    fs.writeFileSync(articlesFilePath, JSON.stringify(articles, null, 2));
    res.status(201).json(newArticle);

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//blogs.js ends...
//profile.js starts
app.get('/users', (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/users', (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    const newUser = req.body;
    users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
///profile
// Profile route to retrieve user information
app.get('/profile', (req, res) => {
 
  const loggedInUserr = loggedInUser; // Replace with your actual user identification method

  // Query the database to retrieve user information based on the logged-in user
  const sql = 'SELECT * FROM users WHERE username = ?';

  db.query(sql, [loggedInUserr], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      res.status(500).json({ error: 'Error retrieving user information' });
      return;
    }

    if (results.length === 1) {
      // User found, send the user's information as JSON
      res.status(200).json(results[0]);
    } else {
      // User not found
      res.status(404).json({ error: 'User not found' });
    }
  });
console.log(loggedInUser);

});
/////update profile
app.post('/update-profile', (req, res) => {
  // Ensure that the user is logged in; replace with your actual authentication logic
  if (!loggedInUser) {
    return res.status(401).json({ success: false, error: 'Not logged in' });
  }

  // Extract the updated profile information from the request body
  const { age, bmi, bio, address } = req.body;

  // Define the SQL query to update the user's profile in the database
  const sql = 'UPDATE users SET age = ?, bmi = ?, bio = ?, address = ? WHERE username = ?';

  // Execute the SQL query to update the user's profile
  db.query(sql, [age, bmi, bio, address, loggedInUser], (err, result) => {
    if (err) {
      console.error('Error updating user profile:', err);
      return res.status(500).json({ success: false, error: 'Error updating profile' });
    }

    if (result.affectedRows === 1) {
      return res.status(200).json({ success: true, message: 'Profile updated successfully' });
    } else {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
  });
});

// event create js
app.post('/create-event', (req, res) => {
  // Ensure that the user is logged in; replace with your actual authentication logic
  if (!loggedInUser) {
    console.log("user not logged in");
    return res.status(401).json({ success: false, error: 'Not logged in' });
  }

  // Extract the event data from the request body
  const {
    event_name,
    organizerName,
    location,
    description,
    dateFrom,
    dateTo,
    timings,
    eventType,
    ticketPrice,
    maxParticipants,
    idProof,
  } = req.body;

  // Define the SQL query to insert the event into the database
  // const sql = 'INSERT INTO events_details (organizer_user_id, event_name,organizer_name, location, description, date_from, date_to, event_type, ticket_price, max_participants) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
const sql = 'INSERT INTO events_details (organizer_username, event_name, organizer_name, location, description, date_from, date_to,timings, event_type, ticket_price, max_participants,idProof) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)';

  // Execute the SQL query to create the event
  db.query(
    sql,
    [loggedInUser,event_name,organizerName, location, description, dateFrom, dateTo,timings, eventType, ticketPrice, maxParticipants,idProof],
    (err, result) => {
      if (err) {
        console.error('Error creating the event:', err);
        return res.status(500).json({ success: false, error: 'Error creating the event', details: err.message });
      }

      if (result.affectedRows === 1) {
        return res.status(200).json({ success: true, message: 'Event created successfully' });
      } else {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
    }
  );
});
//event create ends

// event details show js

app.get('/upcoming-events', (req, res) => {
  // Fetch upcoming events from the database

  const query = 'SELECT * FROM events_details WHERE date_to >= CURDATE()';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching upcoming events: ', err);
      res.json({ success: false, error: 'Failed to fetch upcoming events.' });
      return;
    }

    // Send the events as JSON response
    res.json({ success: true, events: results });
  });
});
//event details show js ends

//event join js
app.post('/event_register', (req, res) => {
  // Ensure that the user is logged in; replace with your actual authentication logic
  if (!loggedInUser) {
    console.log("no logged in user");
    return res.status(401).json({ success: false, error: 'Not logged in' });
  }

  // Extract the event registration data from the request body
  const { event_id, nickname, phone, comments } = req.body;

  // Check if there are available slots for the event
  db.query('SELECT max_participants FROM events_details WHERE event_id = ?', [event_id], (err, rows) => {
    if (err) {
      console.error('Error checking available slots:', err);
      return res.status(500).json({ success: false, error: 'Error registering for the event' });
    }

    const maxParticipants = rows[0].max_participants;

    if (maxParticipants <= 0) {
      return res.status(400).json({ success: false, error: 'Event is already full' });
    }

    // Decrement the available slots
  
      // Insert the registration data into the event_registration table
      db.query(
        'INSERT INTO event_registrations (event_id, username, nickname, phone, comments) VALUES (?, ?, ?, ?, ?)',
        [event_id, loggedInUser, nickname, phone, comments],
        (err) => {
          if (err) {
            console.error('Error registering for the event:', err);
            return res.status(500).json({ success: false, error: 'Error registering for the event' });
          }
          db.query('UPDATE events_details SET max_participants = max_participants - 1 WHERE event_id = ?', [event_id], (err) => {
            if (err) {
              console.error('Error updating max participants:', err);
              return res.status(500).json({ success: false, error: 'Error registering for the event' });
            }
      
          return res.status(200).json({ success: true, message: 'Registration successful' });
        }
      );
    });
  });
});

//event join js ends

//create community
app.post('/create-community', (req, res) => {
  // Ensure that the user is logged in; replace with your actual authentication logic
  if (!loggedInUser) {
    console.log("no logged in user");
    return res.status(401).json({ success: false, error: 'Not logged in' });
  }

  // Extract community creation data from the request body
  const { community_name, admin_name, max_participants, description} = req.body;
  // Insert the community data into the community_details table
  db.query(
    'INSERT INTO community_details (username, community_name, admin_name, max_participants, description) VALUES (?, ?, ?, ?, ?)',
    [loggedInUser, community_name, admin_name, max_participants, description],
    (err) => {
      if (err) {
        console.error('Error creating community:', err);
        return res.status(500).json({ success: false, error: 'Error creating the community' });
      }
 
   
      return res.status(200).json({ success: true, message: 'Community created successfully' });
    }
  );
});

//crete community ends
// show communities 
app.get('/upcoming-communities', (req, res) => {
  // Fetch upcoming communities from the database
  const query = 'SELECT * FROM community_details';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching upcoming communities: ', err);
      res.json({ success: false, error: 'Failed to fetch upcoming communities.' });
      return;
    }

    // Send the communities as JSON response
    res.json({ success: true, communities: results });
  });
});

// show communities ends

// community register starts
app.post('/community-register', (req, res) => {
  // Ensure that the user is logged in; replace with your actual authentication logic
  if (!loggedInUser) {
    console.log("no user logged in");
    return res.status(401).json({ success: false, error: 'Not logged in' });
  }

  // Extract the community join data from the request body
  const { community_id, name, contact, comments } = req.body;

  // Check if there are available slots for the community
  db.query('SELECT max_participants FROM community_details WHERE community_id = ?', [community_id], (err, rows) => {
    if (err) {
      console.error('Error checking available slots:', err);
      return res.status(500).json({ success: false, error: 'Error joining the community' });
    }

    const maxParticipants = rows[0].max_participants;

    if (maxParticipants <= 0) {
      return res.status(400).json({ success: false, error: 'Community is already full' });
    }

    // Insert the join data into the community_members table
    db.query(
      'INSERT INTO community_members (community_id, username, name, contact, comments) VALUES (?, ?, ?, ?, ?)',
      [community_id, loggedInUser, name, contact, comments],
      (err) => {
        if (err) {
          console.error('Error joining the community:', err);
          return res.status(500).json({ success: false, error: 'Error joining the community' });
        }

        // Deduct the available slots in the community_details table
        db.query('UPDATE community_details SET max_participants = max_participants - 1 WHERE community_id = ?', [community_id], (err) => {
          if (err) {
            console.error('Error updating max participants:', err);
            return res.status(500).json({ success: false, error: 'Error joining the community' });
          }

          return res.status(200).json({ success: true, message: 'Community join successful' });
        });
      }
    );
  });
});


//your community starts
app.get('/your-communities', (req, res) => {
  // Ensure that the user is logged in; replace with your actual authentication logic
  if (!loggedInUser) {
    console.log("no user logged in");
    return res.status(401).json({ success: false, error: 'Not logged in' });
  }

  // Fetch communities joined by the user from the database
  db.query(
    'SELECT c.community_id, c.community_name, c.admin_name, c.max_participants, c.description FROM community_details AS c ' +
    'INNER JOIN community_members AS m ON c.community_id = m.community_id ' +
    'WHERE m.username = ?',
    [loggedInUser],
    (err, results) => {
      if (err) {
        console.error('Error fetching joined communities: ', err);
        res.json({ success: false, error: 'Failed to fetch joined communities.' });
        return;
      }

      // Send the joined communities as JSON response
      res.json({ success: true, joinedCommunities: results });
    }
  );
});

// your community ends
// community register ends
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
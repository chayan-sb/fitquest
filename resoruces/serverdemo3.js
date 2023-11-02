// const express = require('express');
// const app = express();
// const axios = require('axios');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Serve static files (including input.html and exercise.html)
// app.use(express.static(__dirname + '/public'));

// // Define a route to fetch exercise data
// app.get('/getExercises', async (req, res) => {
//     try {
//         const apiKey = 'b4f5430dccmsh17e9ca3dd84aaf8p1e667bjsnb951c97d6442';
//         const host = 'exercisedb.p.rapidapi.com';

//         const { bodyPart, equipment, target } = req.query;

//         const options = {
//             method: 'GET',
//             url: 'https://exercisedb.p.rapidapi.com/exercises',
//             params: {
//                 bodyPart,
//                 equipment,
//                 target
//             },
//             headers: {
//                 'X-RapidAPI-Key': apiKey,
//                 'X-RapidAPI-Host': host
//             }
//         };

//         const response = await axios.request(options);
//         res.json(response.data);
//     } catch (error) {
//         console.error('Error fetching exercise data:', error);
//         res.status(500).json({ error: 'Error fetching exercise data' });
//     }
// });

// // Define a route to handle the form submission and filter exercises
// app.post('/filter-exercises', async (req, res) => {
//     try {
//         // Retrieve user input from the form submission
//         const bodyPart = req.body.bodyPartInput;
//         const equipment = req.body.equipmentInput;
//         const target = req.body.targetInput;

//         // Fetch exercise data based on user input and filter exercises
//         // Your code to filter exercises here
//         const url = `http://localhost:3000/getExercises?bodyPart=${bodyPart}&equipment=${equipment}&target=${target}`;

//         fetch(url)
//             .then((response) => response.json())
//             .then((data) => {
//                 console.log('Fetched data:', data);
//                 exerciseList.innerHTML = '';

//                 if (Array.isArray(data)) {
//                     const filteredExercises = data.filter((exercise) => {
//                         if (
//                             exercise.bodyPart.toLowerCase().includes(bodyPart.toLowerCase())
//                             && exercise.equipment.toLowerCase().includes(equipment.toLowerCase())
//                             && exercise.target.toLowerCase().includes(target.toLowerCase())
//                         ) {
//                             return true;
//                         }
//                         return false;
//                     });

//                     if (filteredExercises.length > 0) {
//                         filteredExercises.forEach((exercise) => {
//                             console.log('Exercise object:', exercise);

//                             const exerciseItem = document.createElement('li');

//                             const gifImage = document.createElement('img');
//                             gifImage.src = exercise.gifUrl;
//                             gifImage.alt = exercise.name;
//                             exerciseItem.appendChild(gifImage);

//                             const nameHeading = document.createElement('h2');
//                             nameHeading.textContent = exercise.name;
//                             exerciseItem.appendChild(nameHeading);

//                             const descriptionParagraph = document.createElement('p');
//                             descriptionParagraph.textContent = `Body Part: ${exercise.bodyPart}, Equipment: ${exercise.equipment}, Target: ${exercise.target}`;
//                             exerciseItem.appendChild(descriptionParagraph);

//                             exerciseList.appendChild(exerciseItem);
//                         });
//                     } else {
//                         const noResultItem = document.createElement('li');
//                         noResultItem.textContent = 'No exercises found.';
//                         exerciseList.appendChild(noResultItem);
//                     }
//                 } else {
//                     console.error('Data is not an array:', data);
//                 }
//             })
//             .catch((error) => {
//                 console.error('Error:', error);
//             });
    
//         // Send the filtered exercises as a JSON response
//         res.json(filteredExercises);
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'Error filtering exercises' });
//     }
// });

// const port = 3000;
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });
const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files (including input.html and exercise.html)
app.use(express.static(__dirname + '/public'));

async function filterExercises(bodyPart, equipment, target) {
    try {
        const apiKey = 'b4f5430dccmsh17e9ca3dd84aaf8p1e667bjsnb951c97d6442';
        const host = 'exercisedb.p.rapidapi.com';

        const options = {
            method: 'GET',
            url: 'https://exercisedb.p.rapidapi.com/exercises',
            params: {
                bodyPart,
                equipment,
                target
            },
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
        const { bodyPart, equipment, target } = req.query;
        const filteredExercises = await filterExercises(bodyPart, equipment, target);
        res.json(filteredExercises);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error fetching exercise data' });
    }
});

app.post('/filter-exercises', async (req, res) => {
    try {
        const { bodyPartInput, equipmentInput, targetInput } = req.body;
        const filteredExercises = await filterExercises(bodyPartInput, equipmentInput, targetInput);
        res.json(filteredExercises);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error filtering exercises' });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

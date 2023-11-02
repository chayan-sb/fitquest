const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');

app.use(cors());

app.get('/getExercises', async (req, res) => {
    try {
        const apiKey = 'b4f5430dccmsh17e9ca3dd84aaf8p1e667bjsnb951c97d6442';
        const host = 'exercisedb.p.rapidapi.com';

        const { bodyPart, equipment, target } = req.query;

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
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching exercise data:', error);
        res.status(500).json({ error: 'Error fetching exercise data' });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
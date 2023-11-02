const express = require('express');
const router = express.Router();
const { fetchExerciseData } = require('./exerciseApi'); // Import the fetchExerciseData function

router.get('/getExercises', async (req, res) => {
  try {
    const exerciseData = await fetchExerciseData();
    res.json(exerciseData);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching exercise data' });
  }
});

module.exports = router;

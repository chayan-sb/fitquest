//workout.js starts....
async function getAllExercises() {
    try {
        const apiKey = 'ab92245281msh2a49594b99abe1ap1c0686jsn299a422ec561';
        const host = 'exercisedb.p.rapidapi.com';
  
        const options = {
            method: 'GET',
            url: 'https://exercisedb.p.rapidapi.com/exercises',
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
  
  // Remove the /filter-exercises route as it's not needed for this purpose
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
  
  // workout.js ends...
  
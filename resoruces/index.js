// Import necessary libraries, including Axios
const axios = require('axios');

// Define options for the API request
const options = {
  method: 'GET',
  url: 'https://exercisedb.p.rapidapi.com/exercises/targetList',
  headers: {
    'X-RapidAPI-Key': 'b4f5430dccmsh17e9ca3dd84aaf8p1e667bjsnb951c97d6442',
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
  }
};

try {
  const response = await axios.request(options);
  console.log(response.data);
} catch (error) {
  console.error(error);
}

const axios = require('axios');

const baseUrl = 'http://localhost:3001/api/v1/seeder';

const endpoints = [
    '/trigger-seed-airports',       
    '/trigger-seed-airlines',        
    '/trigger-seed-airplanes',     
    '/thumbnail-airport-seed',     
    '/update-airports-ratings',      
    '/trigger-user-seeder',        
    '/flight-seed',
];

const runSeeders = async () => {
  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(`${baseUrl}${endpoint}`);
      console.log(`Success: ${endpoint} - ${response.status} ${response.statusText}`);
    } catch (error) {
      console.error(`Error: ${endpoint} - ${error.message}`);
    }
  }
};

runSeeders();

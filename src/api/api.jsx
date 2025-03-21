import axios from 'axios';

export const API_BASE_URL = {
  // apiUrlConfig: 'http://localhost:3000/api', // Set the base URL to your localhost
  apiUrlConfig: 'https://feecommittee.klabsindia.com/v1/api', // Set the base URL to your localhost

};

export const api = axios.create({
  baseURL: API_BASE_URL.apiUrlConfig, // Use the base URL defined above
  timeout: 10000, // Set a timeout of 10 seconds
  headers: {
    'Content-Type': 'application/json', // Default Content-Type
  },
});

export default api;





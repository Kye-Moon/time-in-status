const axios = require('axios');
import mondaySdk from "monday-sdk-js";

const api = axios.create({
    baseURL : 'http://localhost:8000/api/v1',
});

api.interceptors.request.use(async (config) => {
    const monday = mondaySdk();
    try {
        const response = await monday.get('sessionToken');
        // Assuming the actual token is directly under response.data
        const token = response.data;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error('Error fetching session token:', error);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


export default api;
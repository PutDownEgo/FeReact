import axios from 'axios';

const publicApi = axios.create({
    baseURL: process.env.REACT_APP_API_ENDPOINT,
});

export default publicApi;
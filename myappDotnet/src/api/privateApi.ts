import axios from 'axios';

let store: any;

export const injectStore = (_store: any) => {
    store = _store;
};

const privateApi = axios.create({
    baseURL: process.env.REACT_APP_API_ENDPOINT,
});

privateApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

privateApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { response } = error;
        const originalRequest = error.config;

        if (response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const response = await store.refreshToken();
                if (response) {
                    const token = localStorage.getItem('accessToken');
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                }

                return privateApi(originalRequest);
            } catch (e) {
                return Promise.reject(e);
            }
        }
        return Promise.reject(error);
    }
);

export default privateApi;

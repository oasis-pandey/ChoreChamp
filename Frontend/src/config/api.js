// API configuration for different environments

const getApiBaseUrl = () => {
    // For now, always use the deployed backend
    return process.env.REACT_APP_API_URL || 'https://chorechamp-backend.onrender.com/api';

    // Original logic commented out for testing
    // if (process.env.NODE_ENV === 'production') {
    //     return process.env.REACT_APP_API_URL || 'https://chorechamp-backend.onrender.com/api';
    // }
    // return '/api'; // This would use the proxy in package.json
};

export const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;

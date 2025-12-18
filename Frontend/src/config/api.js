// API configuration for different environments

const getApiBaseUrl = () => {
    // Use environment variable if set
    if (process.env.REACT_APP_API_URL) {
        return process.env.REACT_APP_API_URL;
    }

    if (process.env.NODE_ENV === 'production') {
        return 'https://chorechamp-backend.onrender.com/api';
    }

    // For local development, use the host machine's port
    return 'http://localhost:5001/api';
};

export const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;

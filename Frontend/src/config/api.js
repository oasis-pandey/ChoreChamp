// API configuration for different environments

const getApiBaseUrl = () => {
    // Check if we're in production
    if (process.env.NODE_ENV === 'production') {
        // Use environment variable for production API URL, fallback to a default
        return process.env.REACT_APP_API_URL || 'https://your-backend-api.herokuapp.com/api';
    }

    // Development environment
    return '/api'; // This will use the proxy in package.json
};

export const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;

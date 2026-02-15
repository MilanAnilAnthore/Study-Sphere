const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper to get auth token
export const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

// Helper to set auth token
export const setAuthToken = (token) => {
    localStorage.setItem('authToken', token);
};

// Helper to remove auth token
export const removeAuthToken = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
};

// Authenticated fetch helper
export const authFetch = async (url, options = {}) => {
    const token = getAuthToken();

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers
        }
    };

    const response = await fetch(`${API_BASE}${url}`, config);

    // Handle 401 - redirect to login
    if (response.status === 401) {
        removeAuthToken();
        window.location.href = '/';
        throw new Error('Session expired');
    }

    return response;
};

export default API_BASE;
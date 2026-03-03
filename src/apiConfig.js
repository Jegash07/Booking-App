// Centralized API configuration to handle different environments (Local vs Production)
const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
        ? `http://${window.location.hostname}:5000` // Try to use the same host as the frontend if it's on local network
        : 'http://localhost:5000');

// NOTE: For mobile testing on same Wi-Fi, change your .env VITE_API_URL to:
// VITE_API_URL=http://192.168.29.48:5000

export default API_BASE_URL;

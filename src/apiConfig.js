// Centralized API configuration to handle different environments (Local vs Production)
// If VITE_API_URL is defined in .env, it uses that, otherwise defaults to localhost:5000
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// NOTE: For Vercel deployment, set VITE_API_URL in your Vercel Dashboard -> Settings -> Environment Variables
// Example: VITE_API_URL=https://your-backend-api.onrender.com

export default API_BASE_URL;

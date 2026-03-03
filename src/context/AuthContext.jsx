import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';

// Create Auth context for managing authentication state across the app
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // stores user info & token
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for persistent login on page load
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
            return { success: true };
        } catch (error) {
            console.error('API Login Error:', error);

            // FALLBACK LOGIC: If server is unreachable, check mock database in localStorage
            if (!error.response) {
                const mockUsers = JSON.parse(localStorage.getItem('fallback_users') || '[]');
                const foundUser = mockUsers.find(u => u.email === email && u.password === password);

                if (foundUser) {
                    const userData = { ...foundUser, token: 'mock-token-offline' };
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                    return { success: true, message: 'LoggedIn in Offline Mode' };
                }
                return { success: false, message: 'Server unreachable and user not found locally.' };
            }
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };


    const register = async (name, email, password, role) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/register`, { name, email, password, role });
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
            return { success: true };
        } catch (error) {
            console.error('API Registration Error:', error);

            // Detailed Connectivity error handling
            if (!error.response) {
                // If it's a network error (no response)
                const isLocalhost = API_BASE_URL.includes('localhost');
                const errorMessage = isLocalhost
                    ? 'Server unreachable. If you are on mobile, use your laptop IP instead of localhost.'
                    : 'Server unreachable. Please check your internet connection or backend status.';

                // FALLBACK LOGIC: Save account to local mock database for demo purposes
                const mockUsers = JSON.parse(localStorage.getItem('fallback_users') || '[]');

                if (mockUsers.some(u => u.email === email)) {
                    return { success: false, message: 'Email already registered in offline mode.' };
                }

                const newUser = { _id: `offline-${Date.now()}`, name, email, password, role: role || 'user' };
                mockUsers.push(newUser);
                localStorage.setItem('fallback_users', JSON.stringify(mockUsers));

                const userData = { ...newUser, token: 'mock-token-offline' };
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));

                return { success: true, message: `Offline Mode: ${errorMessage}` };
            }
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };


    const logout = () => {
        setUser(null);
        localStorage.removeItem('user'); // Clear token on logout
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

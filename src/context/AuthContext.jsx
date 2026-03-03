import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

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
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
            return { success: true };
        } catch (error) {
            console.error('API Login Error:', error);
            if (!error.response) {
                return { success: false, message: 'Server unreachable. Please check your backend connection.' };
            }
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };


    const register = async (name, email, password, role) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
            return { success: true };
        } catch (error) {
            console.error('API Registration Error:', error);
            if (!error.response) {
                // Network error (server might be down or unreachable)
                return { success: false, message: 'Server unreachable. Please check if your backend is running on port 5000.' };
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

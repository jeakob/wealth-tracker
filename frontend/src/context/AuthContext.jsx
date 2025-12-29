import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Set token in axios defaults
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Load current user
            loadUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const loadUser = async () => {
        try {
            const response = await axios.get(`${API_URL}/auth/me`);
            setUser(response.data);
        } catch (error) {
            console.error('Failed to load user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                username,
                password,
            });

            const { access_token, user: userData } = response.data;

            setToken(access_token);
            setUser(userData);
            localStorage.setItem('token', access_token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

            return { success: true };
        } catch (error) {
            console.error('Login failed:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Invalid credentials',
            };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    const register = async (username, password, role) => {
        try {
            await axios.post(`${API_URL}/auth/register`, {
                username,
                password,
                role,
            });
            return { success: true };
        } catch (error) {
            console.error('Registration failed:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed',
            };
        }
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        register,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

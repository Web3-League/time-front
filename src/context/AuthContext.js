import React, { createContext, useState, useEffect, useContext } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRole] = useState(null);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          const decodedToken = jwtDecode(storedToken);
          setToken(storedToken);
          setUserId(decodedToken.userId);
          setRole(decodedToken.roles);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Initialization error:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8083/api/auth/login', { email, password });
      const { token } = response.data;
      const decodedToken = jwtDecode(token);
      await AsyncStorage.setItem('token', token);
      setToken(token);
      setUserId(decodedToken.userId);
      setRole(decodedToken.roles);
      setIsAuthenticated(true);
      setError(null);
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response ? error.response.data.message : 'Login failed');
      throw new Error(error.response ? error.response.data.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8083/api/auth/register', { email, password });
      const { token } = response.data;
      const decodedToken = jwtDecode(token);
      await AsyncStorage.setItem('token', token);
      setToken(token);
      setUserId(decodedToken.userId);
      setRole(decodedToken.roles);
      setIsAuthenticated(true);
      setError(null);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response ? error.response.data.message : 'Registration failed');
      throw new Error(error.response ? error.response.data.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem('token');
      setToken(null);
      setUserId(null);
      setRole(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        isAuthenticated,
        loading,
        error,
        roles,
        login,
        logout,
        register,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthContext };

import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        // Verify token by fetching user
        const response = await api.get('/user');
        setUser(response.data);
      }
    } catch (e) {
      console.log('User check failed:', e);
      setUser(null);
      await SecureStore.deleteItemAsync('token');
    } finally {
      setSplashLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      const { access_token } = response.data;

      await SecureStore.setItemAsync('token', access_token);

      const userRes = await api.get('/user');
      setUser(userRes.data);
    } catch (e) {
      console.error('Login failed:', e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data) => {
    setIsLoading(true);
    try {
      const response = await api.post('/register', data);
       const { access_token } = response.data;
       await SecureStore.setItemAsync('token', access_token);

       const userRes = await api.get('/user');
       setUser(userRes.data);
    } catch (e) {
      console.error('Register failed:', e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
        await api.post('/logout');
    } catch(e) {
        console.log(e);
    }
    await SecureStore.deleteItemAsync('token');
    setUser(null);
    setIsLoading(false);
  };

  const refreshUser = async () => {
       try {
        const response = await api.get('/user');
        setUser(response.data);
      } catch (e) {
        console.log(e);
      }
  }

  return (
    <AuthContext.Provider value={{
        user,
        isLoading,
        splashLoading,
        login,
        register,
        logout,
        refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.data.user) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.log('No active session found');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user: userData } = res.data;
      setUser(userData);
      return userData;
    } catch (error) {
      if (error.response && error.response.status === 401 && error.response.data.isVerified === false) {
        // User is not verified, return special error to handle redirect
        throw { ...error, needsVerification: true };
      }
      throw error;
    }
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data; // Return full response to get email for verification
  };

  const verifyOTP = async (email, otp) => {
    const res = await api.post('/auth/verify-otp', { email, otp });
    return res.data;
  };

  const resendOTP = async (email) => {
    const res = await api.post('/auth/resend-otp', { email });
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const updatePoints = (newPoints) => {
    setUser(prev => ({ ...prev, ecoPoints: newPoints }));
  }

  const updateLevel = (newLevel) => {
    setUser(prev => ({ ...prev, level: newLevel }));
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, verifyOTP, resendOTP, logout, updatePoints, updateLevel }}>
      {children}
    </AuthContext.Provider>
  );
};

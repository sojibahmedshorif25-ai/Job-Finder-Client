import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const BETTER_AUTH_URL = `${API_URL}/auth-better`;

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

const betterAuthClient = axios.create({
  baseURL: BETTER_AUTH_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [premiumStatus, setPremiumStatus] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await apiClient.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        if (res.data.user.role === "Founder") {
          const premRes = await apiClient.get('/payments/status');
          setPremiumStatus(premRes.data.isPremium);
        }
        return res.data.user;
      }
    } catch (err) {
      // ignore
    }
    return null;
  };

  const checkSession = async () => {
    try {
      setLoading(true);
      const baRes = await betterAuthClient.get('/session');
      if (baRes.data && baRes.data.user) {
        await fetchProfile();
      } else {
        setUser(null);
      }
    } catch (err) {
      await fetchProfile();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      // Try Better Auth first
      try {
        const res = await betterAuthClient.post('/sign-in', { email, password });
        if (res.data && res.data.user) {
          const profileUser = await fetchProfile();
          if (profileUser?.role === "Founder") {
            const premRes = await apiClient.get('/payments/status');
            setPremiumStatus(premRes.data.isPremium);
          }
          return { success: true };
        }
      } catch (baErr) {
        // Better Auth failed, fallback to custom JWT auth (for seed users)
        const res = await apiClient.post('/auth/login', { email, password });
        if (res.data.success) {
          setUser(res.data.user);
          if (res.data.user.role === "Founder") {
            const premRes = await apiClient.get('/payments/status');
            setPremiumStatus(premRes.data.isPremium);
          }
          return { success: true };
        }
      }
      return { success: false, message: "Login failed" };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Invalid email or password"
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      // Try Better Auth first
      try {
        const res = await betterAuthClient.post('/sign-up', {
          email: userData.email,
          password: userData.password,
          name: userData.name,
          role: userData.role,
          image: userData.image
        });
        if (res.data && res.data.user) {
          await fetchProfile();
          setPremiumStatus(false);
          return { success: true };
        }
      } catch (baErr) {
        // Better Auth failed, fallback to custom JWT auth
        const res = await apiClient.post('/auth/register', userData);
        if (res.data.success) {
          setUser(res.data.user);
          setPremiumStatus(false);
          return { success: true };
        }
      }
      return { success: false, message: "Registration failed" };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed. Please try again."
      };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (googleData) => {
    try {
      setLoading(true);
      const res = await apiClient.post('/auth/google', googleData);
      if (res.data.success) {
        setUser(res.data.user);
        if (res.data.user.role === "Founder") {
          const premRes = await apiClient.get('/payments/status');
          setPremiumStatus(premRes.data.isPremium);
        }
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Google authentication failed"
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await betterAuthClient.post('/sign-out');
      setUser(null);
      setPremiumStatus(false);
      return { success: true };
    } catch (err) {
      try { await apiClient.post('/auth/logout'); } catch (_) {}
      setUser(null);
      setPremiumStatus(false);
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await apiClient.put('/auth/profile', profileData);
      if (res.data.success) {
        setUser(prev => ({
          ...prev,
          ...res.data.user
        }));
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Profile update failed"
      };
    }
  };

  const refreshPremium = async () => {
    if (user && user.role === "Founder") {
      try {
        const res = await apiClient.get('/payments/status');
        setPremiumStatus(res.data.isPremium);
      } catch (err) {
        console.error("Failed to refresh premium", err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        premiumStatus,
        login,
        register,
        loginWithGoogle,
        logout,
        updateProfile,
        refreshPremium,
        checkSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Configure default axios properties for cookie handling
axios.defaults.withCredentials = true;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [premiumStatus, setPremiumStatus] = useState(false);

  // Fetch current user session
  const checkSession = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/auth/me`);
      if (res.data.success) {
        setUser(res.data.user);
        // Check premium status if founder
        if (res.data.user.role === "Founder") {
          const premRes = await axios.get(`${API_URL}/payments/status`);
          setPremiumStatus(premRes.data.isPremium);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (res.data.success) {
        setUser(res.data.user);
        if (res.data.user.role === "Founder") {
          const premRes = await axios.get(`${API_URL}/payments/status`);
          setPremiumStatus(premRes.data.isPremium);
        }
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed. Please check your credentials."
      };
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/auth/register`, userData);
      if (res.data.success) {
        setUser(res.data.user);
        setPremiumStatus(false);
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed. Please try again."
      };
    } finally {
      setLoading(false);
    }
  };

  // Google Login handler
  const loginWithGoogle = async (googleData) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/auth/google`, googleData);
      if (res.data.success) {
        setUser(res.data.user);
        if (res.data.user.role === "Founder") {
          const premRes = await axios.get(`${API_URL}/payments/status`);
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

  // Logout handler
  const logout = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/auth/logout`);
      setUser(null);
      setPremiumStatus(false);
      return { success: true };
    } catch (err) {
      console.error("Logout error", err);
      setUser(null); // Force reset
      setPremiumStatus(false);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // Update Profile handler
  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put(`${API_URL}/auth/profile`, profileData);
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

  // Refresh Premium Status (e.g. after payment success)
  const refreshPremium = async () => {
    if (user && user.role === "Founder") {
      try {
        const res = await axios.get(`${API_URL}/payments/status`);
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

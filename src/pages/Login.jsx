import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Rocket, Lock, Mail, ShieldAlert } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect intended route (or default dashboard)
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const res = await axios.get(`${API_URL}/auth-better/social-sign-in`);
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else if (res.data) {
        const userData = res.data.user || res.data;
        if (userData?.email) {
          const loginRes = await login(userData.email, "");
          if (loginRes.success) navigate(from, { replace: true });
        }
      }
    } catch (err) {
      setError("Google sign-in failed. Make sure OAuth is configured.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-brand-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-premium p-8 rounded-2xl border border-dark-850 relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-white font-extrabold text-2xl tracking-tight mb-2">
            <Rocket className="h-6 w-6 text-brand-500" />
            <span>
              Startup<span className="text-brand-500">Forge</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-white">Welcome back</h2>
          <p className="text-xs text-slate-500 mt-1">
            New to the platform?{" "}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
              Register here
            </Link>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded bg-red-950/20 border border-red-500/25 flex items-center space-x-2 text-red-400 text-xs">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-650" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-dark-900 border border-dark-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-brand-500/60 transition-colors"
                placeholder="founder1@tesla.com (or admin@startupforge.com)"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <Link to="/login" className="text-[10px] text-slate-600 cursor-not-allowed" title="Password reset coming soon">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-650" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-dark-900 border border-dark-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-brand-500/60 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:bg-dark-800 disabled:text-slate-650 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wide transition-all duration-300 cursor-pointer shadow-md shadow-brand-600/10"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Test Accounts Tip */}
        <div className="mt-4 p-3 bg-dark-950/80 border border-dark-900 rounded-lg text-[10px] text-slate-500 leading-relaxed">
          <span className="font-bold text-brand-400 uppercase tracking-wider block mb-1">Local Seeding Credentials:</span>
          Admin: <strong className="text-slate-400">admin@startupforge.com</strong> / AdminPassword123!<br />
          Founder: <strong className="text-slate-400">founder1@tesla.com</strong> / FounderPassword123!<br />
          Collaborator: <strong className="text-slate-400">collab1@gmail.com</strong> / CollabPassword123!
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dark-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-dark-950 px-2 text-slate-600">Or continue with</span>
          </div>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full py-2.5 px-4 rounded-lg bg-dark-900 hover:bg-dark-850 text-slate-350 border border-dark-800 font-semibold text-xs tracking-wide transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 0, 0)">
              <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.57h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.37C21.68,11.83 21.57,11.43 21.35,11.1z" fill="#4285F4" />
              <path d="M12,20.73c2.43,0 4.47,-0.8 5.96,-2.2l-3.3,-2.57c-0.9,0.6 -2.07,0.97 -3.3,0.97 -2.34,0 -4.33,-1.58 -5.04,-3.7H2.9v2.66c1.5,2.98 4.6,5.16 8.2,5.16z" fill="#34A853" />
              <path d="M6.96,13.23c-0.18,-0.54 -0.28,-1.1 -0.28,-1.68c0,-0.58 0.1,-1.14 0.28,-1.68V7.21H2.9C2.3,8.4 1.97,9.75 1.97,11.2c0,1.45 0.33,2.8 0.93,4L6.96,13.23z" fill="#FBBC05" />
              <path d="M12,5.07c1.32,0 2.5,0.45 3.44,1.35l2.58,-2.58C16.46,2.38 14.42,1.67 12,1.67 8.4,1.67 5.3,3.85 3.8,6.83L6.96,9.5c0.7,-2.12 2.7,-3.7 5.04,-3.7z" fill="#EA4335" />
            </g>
          </svg>
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}

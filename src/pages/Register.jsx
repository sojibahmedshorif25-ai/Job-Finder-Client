import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Rocket, Upload, Lock, Mail, User, ShieldAlert, Check, X } from "lucide-react";
import axios from "axios";

export default function Register() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Collaborator" // Default role
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Password rules validation states
  const passwordRules = {
    length: formData.password.length >= 6,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>_]/.test(formData.password)
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadToImgBB = async (file) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY || "85c1815b3c3b53f6fa11075677ce9eb4"; // Fallback public key or let candidate configure it
    const form = new FormData();
    form.append("image", file);

    try {
      setUploadingImage(true);
      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, form);
      return res.data.data.url;
    } catch (err) {
      console.error("ImgBB upload failed, falling back to dummy avatar", err);
      // Fallback in case API key is expired or invalid
      return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(formData.name || "user")}`;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate password rules
    if (!passwordRules.length || !passwordRules.uppercase || !passwordRules.lowercase || !passwordRules.number || !passwordRules.special) {
      setError("Please ensure password matches all security requirements.");
      return;
    }

    if (!imageFile) {
      setError("Please upload a profile image.");
      return;
    }

    try {
      setLoading(true);

      // 1. Upload to ImgBB
      const imageUrl = await uploadToImgBB(imageFile);

      // 2. Submit user registration
      const registerData = {
        ...formData,
        image: imageUrl
      };

      const res = await register(registerData);
      if (res.success) {
        navigate("/dashboard");
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth mock login
  const handleGoogleSignup = async () => {
    setError("");
    const mockGoogleUser = {
      email: `google_${Math.floor(Math.random() * 10000)}@gmail.com`,
      name: "Google Explorer",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150",
      role: formData.role // Selected role
    };

    const res = await loginWithGoogle(mockGoogleUser);
    if (res.success) {
      navigate("/dashboard");
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-brand-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-premium p-8 rounded-2xl border border-dark-850 relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-white font-extrabold text-2xl tracking-tight mb-2">
            <Rocket className="h-6 w-6 text-brand-500" />
            <span>
              Startup<span className="text-brand-500">Forge</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-white">Create your account</h2>
          <p className="text-xs text-slate-500 mt-1">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
              Login here
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
          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-650" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2.5 bg-dark-900 border border-dark-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-brand-500/60 transition-colors"
                placeholder="Alex Smith"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-650" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2.5 bg-dark-900 border border-dark-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-brand-500/60 transition-colors"
                placeholder="alex@example.com"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label
                className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                  formData.role === "Founder"
                    ? "border-brand-500 bg-brand-500/5 text-white font-bold"
                    : "border-dark-800 bg-dark-900 text-slate-400"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="Founder"
                  checked={formData.role === "Founder"}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <span>Startup Founder</span>
              </label>

              <label
                className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                  formData.role === "Collaborator"
                    ? "border-brand-500 bg-brand-500/5 text-white font-bold"
                    : "border-dark-800 bg-dark-900 text-slate-400"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="Collaborator"
                  checked={formData.role === "Collaborator"}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <span>Collaborator</span>
              </label>
            </div>
          </div>

          {/* Profile Image (ImgBB upload) */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Profile Image
            </label>
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-dark-900 border border-dark-800 flex items-center justify-center overflow-hidden shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <Upload className="h-5 w-5 text-slate-650" />
                )}
              </div>
              <label className="flex-grow flex items-center justify-center px-4 py-2 border border-dashed border-dark-800 hover:border-brand-500/50 rounded-lg cursor-pointer bg-dark-900 text-xs font-medium text-slate-400 hover:text-white transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
                <span>{imageFile ? imageFile.name : "Choose profile file..."}</span>
              </label>
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-650" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2.5 bg-dark-900 border border-dark-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-brand-500/60 transition-colors"
                placeholder="••••••••"
              />
            </div>
            
            {/* Password Validation Checklist */}
            <div className="mt-2.5 p-2.5 bg-dark-950 border border-dark-900 rounded-lg space-y-1 text-[10px]">
              <div className="flex items-center space-x-1.5">
                {passwordRules.length ? (
                  <Check className="h-3 w-3 text-emerald-400" />
                ) : (
                  <X className="h-3 w-3 text-slate-600" />
                )}
                <span className={passwordRules.length ? "text-slate-350" : "text-slate-500"}>At least 6 characters</span>
              </div>
              <div className="flex items-center space-x-1.5">
                {passwordRules.uppercase ? (
                  <Check className="h-3 w-3 text-emerald-400" />
                ) : (
                  <X className="h-3 w-3 text-slate-600" />
                )}
                <span className={passwordRules.uppercase ? "text-slate-350" : "text-slate-500"}>At least one uppercase letter</span>
              </div>
              <div className="flex items-center space-x-1.5">
                {passwordRules.lowercase ? (
                  <Check className="h-3 w-3 text-emerald-400" />
                ) : (
                  <X className="h-3 w-3 text-slate-600" />
                )}
                <span className={passwordRules.lowercase ? "text-slate-350" : "text-slate-500"}>At least one lowercase letter</span>
              </div>
              <div className="flex items-center space-x-1.5">
                {passwordRules.number ? (
                  <Check className="h-3 w-3 text-emerald-400" />
                ) : (
                  <X className="h-3 w-3 text-slate-600" />
                )}
                <span className={passwordRules.number ? "text-slate-350" : "text-slate-500"}>At least one number</span>
              </div>
              <div className="flex items-center space-x-1.5">
                {passwordRules.special ? (
                  <Check className="h-3 w-3 text-emerald-400" />
                ) : (
                  <X className="h-3 w-3 text-slate-600" />
                )}
                <span className={passwordRules.special ? "text-slate-350" : "text-slate-500"}>At least one special character</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="w-full py-3 px-4 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:bg-dark-800 disabled:text-slate-650 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wide transition-all duration-300 cursor-pointer shadow-md shadow-brand-600/10"
          >
            {loading ? "Registering..." : uploadingImage ? "Uploading Image..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dark-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-dark-950 px-2 text-slate-600">Or continue with</span>
          </div>
        </div>

        {/* Google Signup Button */}
        <button
          onClick={handleGoogleSignup}
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
          <span>Sign up with Google</span>
        </button>
      </div>
    </div>
  );
}

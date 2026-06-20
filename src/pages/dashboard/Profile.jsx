import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { User, Upload, Check, ShieldAlert } from "lucide-react";
import axios from "axios";
import Loading from "../Loading";

export default function Profile() {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    skills: "" // Comma separated list
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        skills: user.skills ? user.skills.join(", ") : ""
      });
      setImagePreview(user.image || "");
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadToImgBB = async (file) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY || "85c1815b3c3b53f6fa11075677ce9eb4";
    const form = new FormData();
    form.append("image", file);

    try {
      setUploadingImage(true);
      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, form);
      return res.data.data.url;
    } catch (err) {
      console.error("ImgBB upload failed", err);
      return imagePreview || "";
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
      let imageUrl = imagePreview;

      if (imageFile) {
        imageUrl = await uploadToImgBB(imageFile);
      }

      const skillsArray = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const updateData = {
        name: formData.name,
        image: imageUrl,
        bio: formData.bio,
        skills: skillsArray
      };

      const res = await updateProfile(updateData);
      if (res.success) {
        setMessage("Profile updated successfully!");
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <Loading />;

  return (
    <div className="max-w-2xl mx-auto glass p-8 rounded-2xl border border-dark-850 space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center space-x-2 border-b border-dark-900 pb-3">
        <User className="h-5.5 w-5.5 text-brand-500" />
        <span>Manage My Profile</span>
      </h2>

      {message && (
        <div className="p-3 bg-emerald-950/20 border border-emerald-500/25 rounded text-emerald-400 text-xs">
          {message}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-950/20 border border-red-500/25 rounded text-red-400 text-xs flex items-center space-x-1.5">
          <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Profile picture */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Profile Picture
          </label>
          <div className="flex items-center space-x-4">
            <img
              src={imagePreview || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150"}
              alt="Avatar preview"
              className="h-16 w-16 rounded-full object-cover border-2 border-brand-500/40"
            />
            <label className="flex-grow flex items-center justify-center px-4 py-2 border border-dashed border-dark-800 hover:border-brand-500/50 rounded-lg cursor-pointer bg-dark-900 text-xs font-medium text-slate-400 hover:text-white transition-all">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
              />
              <span>{imageFile ? imageFile.name : "Upload new profile photo..."}</span>
            </label>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 bg-dark-900 border border-dark-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-brand-500/60"
            placeholder="Alex Smith"
          />
        </div>

        {/* Email (Disabled) */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Email Address (Primary Account Key)
          </label>
          <input
            type="email"
            disabled
            value={user.email}
            className="w-full px-4 py-2.5 bg-dark-950 border border-dark-900 rounded-lg text-sm text-slate-500 cursor-not-allowed"
          />
        </div>

        {/* Collaborator Skills */}
        {user.role === "Collaborator" && (
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Professional Skills (Comma separated)
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-dark-900 border border-dark-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-brand-500/60"
              placeholder="React, Express, MongoDB, Figma, CSS"
            />
            <span className="text-[10px] text-slate-650 mt-1 block">Specify matching keywords so startup founders can search for you.</span>
          </div>
        )}

        {/* Bio */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Professional Bio
          </label>
          <textarea
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 bg-dark-900 border border-dark-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-brand-500/60 resize-none"
            placeholder="Introduce yourself, your background, and what type of projects you want to build..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={saving || uploadingImage}
          className="px-6 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold tracking-wider transition-all disabled:opacity-50 cursor-pointer"
        >
          {saving ? "Saving Changes..." : uploadingImage ? "Uploading Photo..." : "Save Profile Details"}
        </button>
      </form>
    </div>
  );
}

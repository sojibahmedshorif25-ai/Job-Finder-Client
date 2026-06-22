import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { PlusCircle, ShieldAlert, Sparkles, Building, ChevronRight } from "lucide-react";
import Loading from "../Loading";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AddOpportunity() {
  const { premiumStatus, refreshPremium } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [startup, setStartup] = useState(null);
  const [opportunityCount, setOpportunityCount] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    role_title: "",
    required_skills: "", // Comma separated text
    work_type: "Remote",
    commitment_level: "Full-time",
    deadline: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkEligibility = async () => {
      try {
        setLoading(true);
        // 1. Fetch startup profile
        const startupRes = await axios.get(`${API_URL}/startups/my-startup`);
        if (startupRes.data.success && startupRes.data.startup) {
          setStartup(startupRes.data.startup);
        }

        // 2. Fetch current postings count
        const oppsRes = await axios.get(`${API_URL}/opportunities/my-postings`);
        if (oppsRes.data.success) {
          setOpportunityCount(oppsRes.data.opportunities.length);
        }

        await refreshPremium();
      } catch (err) {
        console.error("Eligibility check failed", err);
      } finally {
        setLoading(false);
      }
    };

    checkEligibility();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    // Validate date deadline
    if (new Date(formData.deadline) < new Date()) {
      setError("Application deadline cannot be in the past.");
      setSubmitting(false);
      return;
    }

    try {
      const skillsArray = formData.required_skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const payload = {
        role_title: formData.role_title,
        required_skills: skillsArray,
        work_type: formData.work_type,
        commitment_level: formData.commitment_level,
        deadline: formData.deadline
      };

      const res = await axios.post(`${API_URL}/opportunities`, payload);
      if (res.data.success) {
        setSuccess("Opportunity posted successfully!");
        setFormData({
          role_title: "",
          required_skills: "",
          work_type: "Remote",
          commitment_level: "Full-time",
          deadline: ""
        });
        setOpportunityCount(prev => prev + 1);
        setTimeout(() => {
          navigate("/dashboard/manage-opportunities");
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post opportunity.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  // 1. Guard: No startup profile
  if (!startup) {
    return (
      <div className="glass p-8 rounded-2xl border border-dark-850 text-center max-w-xl mx-auto space-y-4">
        <Building className="h-12 w-12 text-slate-755 mx-auto" />
        <h3 className="text-lg font-bold text-white">Create Startup Profile First</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          You must set up your Startup profile, brand name, and description before posting opportunities to our collaborator network.
        </p>
        <Link
          to="/dashboard/my-startup"
          className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all"
        >
          <span>Setup My Startup</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  // 2. Guard: Startup is pending approval
  if (startup.status !== "Approved") {
    return (
      <div className="glass p-8 rounded-2xl border border-dark-850 text-center max-w-xl mx-auto space-y-4">
        <ShieldAlert className="h-12 w-12 text-amber-500 mx-auto" />
        <h3 className="text-lg font-bold text-white">Startup Profile Pending</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Your startup profile <strong>{startup.startup_name}</strong> is currently pending admin approval. You can post team opportunities once the platform admins review and approve your card.
        </p>
        <Link
          to="/dashboard/overview"
          className="text-xs text-brand-400 hover:text-brand-300 font-semibold"
        >
          Back to Overview
        </Link>
      </div>
    );
  }

  // 3. Guard: Free tier limits reached
  const isEligible = premiumStatus || opportunityCount < 3;
  if (!isEligible) {
    return (
      <div className="glass p-8 rounded-2xl border border-dark-850 text-center max-w-xl mx-auto space-y-4">
        <Sparkles className="h-12 w-12 text-brand-400 mx-auto animate-pulse" />
        <h3 className="text-lg font-bold text-white">Free Listing Limit Reached</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          You have already posted <strong className="text-white">{opportunityCount}/3 free opportunities</strong>. To list more positions, upgrade to Premium on your startup workspace dashboard.
        </p>
        <Link
          to="/dashboard/my-startup"
          className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all"
        >
          <span>Upgrade to Premium</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto glass p-8 rounded-2xl border border-dark-850 space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center space-x-2 border-b border-dark-900 pb-3">
        <PlusCircle className="h-5.5 w-5.5 text-brand-500" />
        <span>Post a Team Opportunity</span>
      </h2>

      <div className="text-[10px] text-slate-500 flex items-center justify-between bg-dark-950/40 p-2.5 rounded-lg border border-dark-900">
        <span>Current Posts: <strong>{opportunityCount}</strong> {!premiumStatus && "(Max 3 free)"}</span>
        {premiumStatus ? (
          <span className="text-emerald-400 font-bold">👑 Unlimited Premium Enabled</span>
        ) : (
          <span className="text-brand-400">{3 - opportunityCount} free posts remaining</span>
        )}
      </div>

      {success && (
        <div className="p-3 bg-emerald-950/20 border border-emerald-500/25 rounded text-emerald-400 text-xs">
          {success}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-950/20 border border-red-500/25 rounded text-red-400 text-xs flex items-center space-x-1.5">
          <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Role Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Role Title
          </label>
          <input
            type="text"
            name="role_title"
            required
            value={formData.role_title}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 bg-dark-900 border border-dark-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-brand-500/60"
            placeholder="Lead Backend Developer (Node.js)"
          />
        </div>

        {/* Required Skills */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Required Skills (Comma separated)
          </label>
          <input
            type="text"
            name="required_skills"
            required
            value={formData.required_skills}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 bg-dark-900 border border-dark-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-brand-500/60"
            placeholder="React, Node.js, TypeScript, Docker"
          />
          <span className="text-[10px] text-slate-650 mt-1 block">Separate skill tags with commas (e.g. C++, Java, Rust).</span>
        </div>

        {/* Work type & Commitment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Work Location Type
            </label>
            <select
              name="work_type"
              value={formData.work_type}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-dark-900 border border-dark-800 rounded-lg text-sm text-slate-400 focus:outline-none focus:border-brand-500/60"
            >
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Commitment Level
            </label>
            <select
              name="commitment_level"
              value={formData.commitment_level}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-dark-900 border border-dark-800 rounded-lg text-sm text-slate-400 focus:outline-none focus:border-brand-500/60"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract / Freelance">Contract / Freelance</option>
              <option value="Equity Share / Partner">Equity Share / Partner</option>
            </select>
          </div>
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Application Deadline
          </label>
          <input
            type="date"
            name="deadline"
            required
            value={formData.deadline}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 bg-dark-900 border border-dark-800 rounded-lg text-sm text-slate-400 focus:outline-none focus:border-brand-500/60"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold tracking-wider transition-all disabled:opacity-50 cursor-pointer"
        >
          {submitting ? "Posting..." : "Post Opportunity"}
        </button>
      </form>
    </div>
  );
}

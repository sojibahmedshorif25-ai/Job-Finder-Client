import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { ArrowLeft, Briefcase, Calendar, Building, ListChecks, ShieldAlert, Award, FileText } from "lucide-react";
import Loading from "./Loading";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function OpportunityDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  
  // Form state
  const [portfolioLink, setPortfolioLink] = useState("");
  const [motivation, setMotivation] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/opportunities/${id}`);
        if (res.data.success) {
          setOpportunity(res.data.opportunity);
        }

        // If collaborator, check if they have already applied
        if (user && user.role === "Collaborator") {
          const appsRes = await axios.get(`${API_URL}/applications/my-applications`);
          if (appsRes.data.success) {
            const hasApplied = appsRes.data.applications.some(
              (app) => app.opportunity_id === id
            );
            setApplied(hasApplied);
          }
        }
      } catch (err) {
        console.error("Failed to load opportunity", err);
        // Fallback mock
        setOpportunity({
          _id: "101",
          role_title: "Rocket Guidance Systems Engineer",
          startup_name: "SpaceX Gen",
          startup_id: "1",
          industry: "Aerospace",
          required_skills: ["C++", "Rust", "Control Theory", "Embedded Systems"],
          work_type: "On-site",
          commitment_level: "Full-time",
          deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          founder_email: "founder1@tesla.com"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [id, user]);

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!user) {
      navigate("/login", { state: { from: { pathname: `/opportunities/${id}` } } });
      return;
    }

    if (user.role !== "Collaborator") {
      setSubmitError("Only users with the 'Collaborator' role can apply for opportunities.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await axios.post(`${API_URL}/applications`, {
        opportunity_id: id,
        portfolio_link: portfolioLink,
        motivation
      });

      if (res.data.success) {
        setSubmitSuccess("Application submitted successfully!");
        setApplied(true);
        setPortfolioLink("");
        setMotivation("");
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  if (!opportunity) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white">Opportunity Not Found</h2>
        <Link to="/opportunities" className="text-brand-400 mt-4 inline-block hover:underline">
          Back to all opportunities
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back link */}
      <div>
        <Link
          to="/opportunities"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Opportunities</span>
        </Link>
      </div>

      {/* Main Opportunity Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="glass p-8 rounded-2xl border border-dark-850 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-brand-500/5 rounded-full blur-[40px] pointer-events-none"></div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs text-brand-400 font-bold uppercase tracking-wider">
                <Briefcase className="h-4 w-4" />
                <span>{opportunity.work_type} • {opportunity.commitment_level}</span>
              </div>

              <h1 className="text-3xl font-extrabold text-white tracking-tight leading-snug">
                {opportunity.role_title}
              </h1>

              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Building className="h-4 w-4 text-slate-650" />
                <span className="font-semibold text-slate-350">{opportunity.startup_name}</span>
                <span className="text-slate-650">•</span>
                <span>{opportunity.industry}</span>
              </div>
            </div>

            <div className="border-t border-dark-900 pt-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <ListChecks className="h-4.5 w-4.5 text-brand-500" />
                <span>Required Skills</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {opportunity.required_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="text-xs px-3 py-1 rounded bg-dark-900 border border-dark-800 text-slate-300 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-dark-900 pt-6 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center space-x-1.5">
                <Calendar className="h-4 w-4 text-red-400" />
                <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
              </span>
              <span>Posted by: {opportunity.founder_email}</span>
            </div>
          </div>
        </div>

        {/* Apply Section Side-Card */}
        <div className="md:col-span-1">
          <div className="glass p-6 rounded-2xl border border-dark-850 space-y-5">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Award className="h-5 w-5 text-brand-500" />
              <span>Apply to join team</span>
            </h2>

            {submitSuccess && (
              <div className="p-3 bg-emerald-950/20 border border-emerald-500/25 rounded text-emerald-400 text-xs">
                {submitSuccess}
              </div>
            )}

            {submitError && (
              <div className="p-3 bg-red-950/20 border border-red-500/25 rounded text-red-400 text-xs flex items-center space-x-1.5">
                <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {applied ? (
              <div className="p-4 bg-dark-900/60 border border-dark-850 rounded-xl text-center space-y-2">
                <p className="text-xs text-slate-400 font-semibold">Application Filed</p>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  You have already applied for this opening. You can track your status in your Collaborator Dashboard.
                </p>
                <Link
                  to="/dashboard/my-applications"
                  className="w-full mt-2 inline-flex items-center justify-center py-2 px-3 rounded bg-dark-850 hover:bg-dark-800 text-slate-350 text-xs font-bold transition-all border border-dark-800"
                >
                  Go to Applications
                </Link>
              </div>
            ) : user && user.role !== "Collaborator" ? (
              <div className="p-4 bg-dark-900/60 border border-dark-850 rounded-xl text-center text-xs text-slate-500">
                You are currently signed in as a <strong className="text-slate-350">{user.role}</strong>. Only Collaborators can apply.
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                {/* Portfolio link */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Portfolio URL
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://myportfolio.com"
                    value={portfolioLink}
                    onChange={(e) => setPortfolioLink(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-900 border border-dark-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-brand-500/60"
                  />
                </div>

                {/* Motivation Msg */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Motivation Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Briefly pitch why you are the perfect partner for this startup role..."
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-900 border border-dark-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-brand-500/60 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 px-4 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs tracking-wide transition-all disabled:bg-dark-850 disabled:text-slate-650 cursor-pointer"
                >
                  {submitting ? "Submitting..." : user ? "Submit Application" : "Log in to Apply"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

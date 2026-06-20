import React, { useEffect, useState } from "react";
import axios from "axios";
import { FolderGit, Check, X, ShieldAlert, ExternalLink, Mail, Clock } from "lucide-react";
import Loading from "../Loading";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/applications/founder-applications`);
      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      console.error("Failed to load founder applications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      setMessage("");
      setError("");
      const res = await axios.put(`${API_URL}/applications/${id}/status`, { status });
      if (res.data.success) {
        setMessage(`Application successfully ${status.toLowerCase()}!`);
        // Update local status to reflect immediately
        setApplications(applications.map((app) => 
          app._id === id ? { ...app, status } : app
        ));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update application status.");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center space-x-2 border-b border-dark-900 pb-3">
        <FolderGit className="h-5.5 w-5.5 text-brand-500" />
        <span>Applications Received ({applications.length})</span>
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

      {applications.length === 0 ? (
        <div className="text-center py-12 bg-dark-900/30 border border-dark-850 rounded-xl text-slate-500 text-sm">
          No applications have been received yet for your startup positions.
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className="glass p-6 rounded-xl border border-dark-850 space-y-4 relative overflow-hidden"
            >
              {/* Top Row: User info and Application status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-900/60 pb-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={app.user_image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80"}
                    alt={app.user_name}
                    className="h-10 w-10 rounded-full border border-brand-500/20 object-cover"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">{app.user_name}</h3>
                    <div className="flex items-center space-x-1.5 text-[10px] text-slate-500">
                      <Mail className="h-3.5 w-3.5" />
                      <span>{app.user_email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Applied for:</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-brand-500/10 text-brand-450 border border-brand-500/15 font-semibold">
                    {app.role_title}
                  </span>
                </div>
              </div>

              {/* Motivation message and details */}
              <div className="space-y-2">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Motivation Pitch</h4>
                  <p className="text-xs text-slate-400 leading-relaxed bg-dark-900/40 p-3 rounded-lg border border-dark-900">
                    "{app.motivation}"
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-slate-550 font-medium">Portfolio:</span>
                    <a
                      href={app.portfolio_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-400 hover:text-brand-300 font-semibold flex items-center space-x-0.5"
                    >
                      <span>{app.portfolio_link}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-slate-550 font-semibold">STATUS:</span>
                    {app.status === "Pending" ? (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold uppercase flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>Pending Review</span>
                      </span>
                    ) : app.status === "Accepted" ? (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                        Accepted
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-bold uppercase">
                        Rejected
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Action Buttons */}
              {app.status === "Pending" && (
                <div className="border-t border-dark-900 pt-3 flex justify-end space-x-2">
                  <button
                    onClick={() => handleStatusChange(app._id, "Rejected")}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded bg-dark-900 hover:bg-red-500/10 border border-dark-800 hover:border-red-500/25 text-xs font-bold text-red-400 transition-colors cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => handleStatusChange(app._id, "Accepted")}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Accept Member</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

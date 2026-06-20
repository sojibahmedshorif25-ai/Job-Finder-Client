import React, { useEffect, useState } from "react";
import axios from "axios";
import { Briefcase, Trash2, Calendar, ShieldAlert } from "lucide-react";
import Loading from "../Loading";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function ManageOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchPostings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/opportunities/my-postings`);
      if (res.data.success) {
        setOpportunities(res.data.opportunities);
      }
    } catch (err) {
      console.error("Failed to load postings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this opportunity? This action cannot be undone.")) {
      return;
    }

    try {
      setMessage("");
      setError("");
      const res = await axios.delete(`${API_URL}/opportunities/${id}`);
      if (res.data.success) {
        setMessage("Opportunity deleted successfully!");
        setOpportunities(opportunities.filter((o) => o._id !== id));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete opportunity.");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center space-x-2 border-b border-dark-900 pb-3">
        <Briefcase className="h-5.5 w-5.5 text-brand-500" />
        <span>Manage My Postings ({opportunities.length})</span>
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

      {opportunities.length === 0 ? (
        <div className="text-center py-12 bg-dark-900/30 border border-dark-850 rounded-xl text-slate-500 text-sm">
          You haven't listed any roles yet. Click "Add Opportunity" to find team members!
        </div>
      ) : (
        <div className="space-y-4">
          {opportunities.map((opp) => (
            <div
              key={opp._id}
              className="glass p-6 rounded-xl border border-dark-850 hover:border-brand-500/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white leading-snug">{opp.role_title}</h3>
                <div className="flex flex-wrap gap-2 text-[10px] text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-dark-900 border border-dark-800">
                    {opp.work_type}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-dark-900 border border-dark-800">
                    {opp.commitment_level}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-dark-900 border border-dark-800 flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>Apply by {new Date(opp.deadline).toLocaleDateString()}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 pt-1.5">
                  {opp.required_skills.map((skill, idx) => (
                    <span key={idx} className="text-[9px] px-1.5 py-0.5 bg-brand-500/5 text-brand-400 border border-brand-500/10 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="shrink-0 flex justify-end">
                <button
                  onClick={() => handleDelete(opp._id)}
                  className="p-2.5 rounded bg-dark-900 hover:bg-red-500/10 text-slate-500 hover:text-red-400 border border-dark-800 hover:border-red-500/20 transition-all cursor-pointer"
                  title="Delete Posting"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

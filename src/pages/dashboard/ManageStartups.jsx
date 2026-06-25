import React, { useEffect, useState } from "react";
import axios from "axios";
import { Building, Check, X, ShieldAlert } from "lucide-react";
import Loading from "../Loading";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function ManageStartups() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchStartups = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/startups`);
      if (res.data.success) {
        setStartups(res.data.startups);
      }
    } catch (err) {
      console.error("Failed to load admin startups", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartups();
  }, []);

  const handleStatusChange = async (id, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this startup?`)) {
      return;
    }

    try {
      setMessage("");
      setError("");
      
      const res = await axios.put(`${API_URL}/admin/startups/${id}/${action}`);
      if (res.data.success) {
        const targetStatus = action === "approve" ? "Approved" : "Removed";
        setMessage(`Startup successfully ${targetStatus.toLowerCase()}!`);
        setStartups(startups.map((s) => 
          s._id === id ? { ...s, status: targetStatus } : s
        ));
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to change startup status.`);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center space-x-2 border-b border-dark-900 pb-3">
        <Building className="h-5.5 w-5.5 text-brand-500" />
        <span>Manage Startups ({startups.length})</span>
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

      <div className="glass rounded-xl border border-dark-850 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-dark-900 border-b border-dark-850 text-slate-400 uppercase tracking-wider font-bold">
                <th className="p-4">Logo & Startup Name</th>
                <th className="p-4">Founder / Email</th>
                <th className="p-4">Industry / Stage</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-900 text-slate-300">
              {startups.map((s) => (
                <tr key={s._id} className="hover:bg-dark-900/30 transition-colors">
                  <td className="p-4 flex items-center space-x-3">
                    <img
                      src={s.logo || "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=80"}
                      alt={s.startup_name}
                      className="h-10 w-10 rounded-lg object-cover border border-dark-800"
                    />
                    <div>
                      <div className="font-bold text-white leading-tight">{s.startup_name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1 max-w-[200px]" title={s.description}>
                        {s.description}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-slate-350">{s.founder_name || "Platform Member"}</div>
                    <div className="text-[9px] text-slate-500">{s.founder_email}</div>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-slate-350">{s.industry}</span>
                    <div className="text-[9px] text-slate-500">{s.funding_stage}</div>
                    <div className="text-[9px] text-slate-600">Team: {s.team_size || "?"}</div>
                  </td>
                  <td className="p-4">
                    {s.status === "Pending" ? (
                      <span className="text-[9px] px-2 py-0.5 rounded bg-amber-950/20 border border-amber-500/20 font-bold uppercase text-amber-400 animate-pulse">
                        Pending Approval
                      </span>
                    ) : s.status === "Approved" ? (
                      <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950/20 border border-emerald-500/20 font-bold uppercase text-emerald-400">
                        Approved
                      </span>
                    ) : (
                      <span className="text-[9px] px-2 py-0.5 rounded bg-red-950/20 border border-red-500/20 font-bold uppercase text-red-400">
                        Removed
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end space-x-1.5">
                      {s.status !== "Removed" && (
                        <button
                          onClick={() => handleStatusChange(s._id, "remove")}
                          className="flex items-center space-x-0.5 px-2 py-1 rounded bg-dark-900 hover:bg-red-500/10 border border-dark-800 hover:border-red-500/25 text-red-400 cursor-pointer"
                          title="Remove Startup"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      )}
                      {s.status !== "Approved" && (
                        <button
                          onClick={() => handleStatusChange(s._id, "approve")}
                          className="flex items-center space-x-0.5 px-2.5 py-1.5 rounded bg-brand-600 hover:bg-brand-500 text-white cursor-pointer"
                          title="Approve Startup"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Approve</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

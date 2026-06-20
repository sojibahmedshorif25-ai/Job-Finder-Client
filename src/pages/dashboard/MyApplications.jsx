import React, { useEffect, useState } from "react";
import axios from "axios";
import { FolderGit, ExternalLink, ShieldCheck, Clock, Ban } from "lucide-react";
import Loading from "../Loading";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/applications/my-applications`);
        if (res.data.success) {
          setApplications(res.data.applications);
        }
      } catch (err) {
        console.error("Failed to load collaborator applications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center space-x-2 border-b border-dark-900 pb-3">
        <FolderGit className="h-5.5 w-5.5 text-brand-500" />
        <span>My Applications ({applications.length})</span>
      </h2>

      {applications.length === 0 ? (
        <div className="text-center py-12 bg-dark-900/30 border border-dark-850 rounded-xl text-slate-500 text-sm">
          You haven't applied for any startup opportunities yet. Explore openings and apply!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className="glass p-6 rounded-xl border border-dark-850 flex flex-col justify-between h-[280px]"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] uppercase font-bold text-brand-400 bg-brand-950/20 border border-brand-500/20 px-2 py-0.5 rounded">
                    {app.startup_name}
                  </span>
                  <div>
                    {app.status === "Pending" ? (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold uppercase flex items-center space-x-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Pending</span>
                      </span>
                    ) : app.status === "Accepted" ? (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase flex items-center space-x-1">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Accepted</span>
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-bold uppercase flex items-center space-x-1">
                        <Ban className="h-3.5 w-3.5" />
                        <span>Rejected</span>
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white leading-snug line-clamp-1">{app.role_title}</h3>
                
                <div className="mt-3">
                  <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Motivation Pitch</h4>
                  <p className="text-xs text-slate-400 line-clamp-4 leading-relaxed bg-dark-900/40 p-2.5 rounded border border-dark-900/60">
                    "{app.motivation}"
                  </p>
                </div>
              </div>

              <div className="border-t border-dark-850/60 pt-4 flex items-center justify-between mt-4 text-xs">
                <div className="flex items-center space-x-1">
                  <span className="text-slate-550">Portfolio:</span>
                  <a
                    href={app.portfolio_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-400 hover:text-brand-300 font-semibold flex items-center space-x-0.5 truncate max-w-[150px]"
                  >
                    <span>Portfolio Link</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <span className="text-[10px] text-slate-550">
                  Applied on {new Date(app.createdAt || app.applied_at || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

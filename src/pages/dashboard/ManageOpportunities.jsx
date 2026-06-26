import React, { useEffect, useState } from "react";
import axios from "axios";
import { Briefcase, Trash2, Edit3, Calendar, ShieldAlert, X, Check } from "lucide-react";
import Loading from "../Loading";

import API_URL from "../../api";

export default function ManageOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    role_title: "",
    required_skills: "",
    work_type: "",
    commitment_level: "",
    deadline: ""
  });
  const [saving, setSaving] = useState(false);

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

  const startEdit = (opp) => {
    setEditingId(opp._id);
    setEditForm({
      role_title: opp.role_title || "",
      required_skills: (opp.required_skills || []).join(", "),
      work_type: opp.work_type || "Remote",
      commitment_level: opp.commitment_level || "Full-time",
      deadline: opp.deadline ? opp.deadline.split("T")[0] : ""
    });
    setError("");
    setMessage("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ role_title: "", required_skills: "", work_type: "", commitment_level: "", deadline: "" });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    setError("");
    setMessage("");
    setSaving(true);
    try {
      const skillsArray = editForm.required_skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const payload = {
        role_title: editForm.role_title,
        required_skills: skillsArray,
        work_type: editForm.work_type,
        commitment_level: editForm.commitment_level,
        deadline: editForm.deadline
      };

      const res = await axios.put(`${API_URL}/opportunities/${id}`, payload);
      if (res.data.success) {
        setMessage("Opportunity updated successfully!");
        setOpportunities(opportunities.map((o) => (o._id === id ? { ...o, ...res.data.opportunity } : o)));
        setEditingId(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update opportunity.");
    } finally {
      setSaving(false);
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
              className="glass p-6 rounded-xl border border-dark-850 hover:border-brand-500/10 transition-all"
            >
              {editingId === opp._id ? (
                /* Edit Mode */
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-brand-400">Editing: {opp.role_title}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Role Title</label>
                      <input type="text" name="role_title" value={editForm.role_title} onChange={handleEditChange}
                        className="w-full px-3 py-2 bg-dark-900 border border-dark-800 rounded text-xs text-slate-200 focus:outline-none focus:border-brand-500/60" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Required Skills (comma-separated)</label>
                      <input type="text" name="required_skills" value={editForm.required_skills} onChange={handleEditChange}
                        className="w-full px-3 py-2 bg-dark-900 border border-dark-800 rounded text-xs text-slate-200 focus:outline-none focus:border-brand-500/60" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Work Type</label>
                      <select name="work_type" value={editForm.work_type} onChange={handleEditChange}
                        className="w-full px-3 py-2 bg-dark-900 border border-dark-800 rounded text-xs text-slate-400 focus:outline-none focus:border-brand-500/60">
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="On-site">On-site</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Commitment</label>
                      <select name="commitment_level" value={editForm.commitment_level} onChange={handleEditChange}
                        className="w-full px-3 py-2 bg-dark-900 border border-dark-800 rounded text-xs text-slate-400 focus:outline-none focus:border-brand-500/60">
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract / Freelance">Contract / Freelance</option>
                        <option value="Equity Share / Partner">Equity Share / Partner</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Deadline</label>
                      <input type="date" name="deadline" value={editForm.deadline} onChange={handleEditChange}
                        className="w-full px-3 py-2 bg-dark-900 border border-dark-800 rounded text-xs text-slate-400 focus:outline-none focus:border-brand-500/60" />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <button onClick={cancelEdit}
                      className="px-3 py-1.5 rounded bg-dark-900 border border-dark-800 text-slate-400 hover:text-white text-xs font-semibold transition-all cursor-pointer">
                      <X className="h-3.5 w-3.5 inline mr-1" />Cancel
                    </button>
                    <button onClick={() => handleSave(opp._id)} disabled={saving}
                      className="px-3 py-1.5 rounded bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-50">
                      <Check className="h-3.5 w-3.5 inline mr-1" />{saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white leading-snug">{opp.role_title}</h3>
                    <div className="flex flex-wrap gap-2 text-[10px] text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-dark-900 border border-dark-800">{opp.work_type}</span>
                      <span className="px-2 py-0.5 rounded bg-dark-900 border border-dark-800">{opp.commitment_level}</span>
                      <span className="px-2 py-0.5 rounded bg-dark-900 border border-dark-800 flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Apply by {new Date(opp.deadline).toLocaleDateString()}</span>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1.5">
                      {opp.required_skills.map((skill, idx) => (
                        <span key={idx} className="text-[9px] px-1.5 py-0.5 bg-brand-500/5 text-brand-400 border border-brand-500/10 rounded">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 flex justify-end space-x-2">
                    <button onClick={() => startEdit(opp)}
                      className="p-2.5 rounded bg-dark-900 hover:bg-brand-500/10 text-slate-500 hover:text-brand-400 border border-dark-800 hover:border-brand-500/20 transition-all cursor-pointer"
                      title="Edit Posting">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(opp._id)}
                      className="p-2.5 rounded bg-dark-900 hover:bg-red-500/10 text-slate-500 hover:text-red-400 border border-dark-800 hover:border-red-500/20 transition-all cursor-pointer"
                      title="Delete Posting">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

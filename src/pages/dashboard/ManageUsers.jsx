import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, Ban, CheckCircle2, ShieldAlert } from "lucide-react";
import Loading from "../Loading";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/users`);
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error("Failed to load admin users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlockUser = async (id, isBlocked) => {
    const action = isBlocked ? "unblock" : "block";
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    try {
      setMessage("");
      setError("");
      
      const res = await axios.put(`${API_URL}/admin/users/${id}/${action}`);
      if (res.data.success) {
        setMessage(`User successfully ${action}ed!`);
        setUsers(users.map((u) => 
          u._id === id ? { ...u, isBlocked: !isBlocked } : u
        ));
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} user.`);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center space-x-2 border-b border-dark-900 pb-3">
        <Users className="h-5.5 w-5.5 text-brand-500" />
        <span>Manage Accounts ({users.length})</span>
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
                <th className="p-4">User Details</th>
                <th className="p-4">Role</th>
                <th className="p-4">System Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-900 text-slate-300">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-dark-900/30 transition-colors">
                  <td className="p-4 flex items-center space-x-3">
                    <img
                      src={u.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80"}
                      alt={u.name}
                      className="h-9 w-9 rounded-full object-cover border border-dark-800"
                    />
                    <div>
                      <div className="font-bold text-white leading-tight">{u.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{u.email}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] uppercase font-bold text-slate-450 bg-dark-900 border border-dark-800 px-2 py-0.5 rounded">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    {u.isBlocked ? (
                      <span className="text-[9px] px-2 py-0.5 rounded bg-red-950/20 border border-red-500/20 font-bold uppercase text-red-400">
                        Suspended / Blocked
                      </span>
                    ) : (
                      <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-950/20 border border-emerald-500/20 font-bold uppercase text-emerald-400">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {u.role === "Admin" ? (
                      <span className="text-[10px] text-slate-600 font-semibold italic">Protected</span>
                    ) : (
                      <button
                        onClick={() => handleBlockUser(u._id, u.isBlocked)}
                        className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                          u.isBlocked
                            ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                            : "bg-dark-900 hover:bg-red-500/10 border border-dark-800 hover:border-red-500/20 text-red-400"
                        }`}
                      >
                        {u.isBlocked ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Unblock</span>
                          </>
                        ) : (
                          <>
                            <Ban className="h-3.5 w-3.5" />
                            <span>Suspend</span>
                          </>
                        )}
                      </button>
                    )}
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

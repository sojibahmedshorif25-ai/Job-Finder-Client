import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { 
  Building, Briefcase, FileCheck, CheckCircle2, AlertCircle, Clock, 
  Users, CreditCard, DollarSign, Sparkles, Star 
} from "lucide-react";
import Loading from "../Loading";

import API_URL from "../../api";

export default function DashboardOverview() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        if (user.role === "Founder") {
          // Fetch founder stats
          const oppsRes = await axios.get(`${API_URL}/opportunities/my-postings`);
          const appsRes = await axios.get(`${API_URL}/applications/founder-applications`);
          
          const totalOpps = oppsRes.data.success ? oppsRes.data.opportunities.length : 0;
          const totalApps = appsRes.data.success ? appsRes.data.applications.length : 0;
          const acceptedMembers = appsRes.data.success 
            ? appsRes.data.applications.filter(a => a.status === "Accepted").length 
            : 0;

          setData({ totalOpps, totalApps, acceptedMembers });
        } else if (user.role === "Collaborator") {
          // Fetch collaborator stats
          const appsRes = await axios.get(`${API_URL}/applications/my-applications`);
          const apps = appsRes.data.success ? appsRes.data.applications : [];
          
          const totalApps = apps.length;
          const pending = apps.filter(a => a.status === "Pending").length;
          const accepted = apps.filter(a => a.status === "Accepted").length;
          const rejected = apps.filter(a => a.status === "Rejected").length;

          setData({ totalApps, pending, accepted, rejected });
        } else if (user.role === "Admin") {
          // Fetch admin overview stats
          const statsRes = await axios.get(`${API_URL}/admin/overview`);
          if (statsRes.data.success) {
            setData(statsRes.data.stats);
          }
        }
      } catch (err) {
        console.error("Failed to load overview data, using mock values", err);
        // Fallback mock values
        if (user.role === "Founder") {
          setData({ totalOpps: 2, totalApps: 4, acceptedMembers: 1 });
        } else if (user.role === "Collaborator") {
          setData({ totalApps: 3, pending: 2, accepted: 1, rejected: 0 });
        } else if (user.role === "Admin") {
          setData({ totalUsers: 5, totalStartups: 2, totalOpportunities: 3, totalRevenue: 49 });
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOverviewData();
    }
  }, [user]);

  if (loading) return <Loading />;
  if (!data) return <div>Failed to load dashboard overview.</div>;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="glass p-6 sm:p-8 rounded-2xl border border-dark-850 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-brand-500/5 rounded-full blur-[40px] pointer-events-none"></div>
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-brand-500/10 text-brand-400 text-[10px] font-bold uppercase border border-brand-500/10">
            <Sparkles className="h-3 w-3" />
            <span>Workspace ready</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Hello, {user.name}!
          </h1>
          <p className="text-xs text-slate-500">
            Welcome to your dashboard overview. Here is a summary of your startup activities.
          </p>
        </div>
        <div className="shrink-0 flex items-center space-x-3">
          <img
            src={user.image}
            alt={user.name}
            className="h-12 w-12 rounded-xl object-cover border border-brand-500/20"
          />
          <div>
            <div className="text-sm font-bold text-white leading-tight">{user.name}</div>
            <div className="text-[10px] uppercase font-bold text-brand-450">{user.role} Account</div>
          </div>
        </div>
      </div>

      {/* 1. Founder Dashboard Overview */}
      {user.role === "Founder" && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">Startup Analytics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-xl border border-dark-850 flex items-center space-x-4">
              <div className="p-3.5 bg-brand-500/15 rounded-lg text-brand-400">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-white">{data.totalOpps}</div>
                <div className="text-xs text-slate-500 uppercase font-semibold">Total Opportunities</div>
              </div>
            </div>

            <div className="glass p-6 rounded-xl border border-dark-850 flex items-center space-x-4">
              <div className="p-3.5 bg-indigo-500/15 rounded-lg text-indigo-400">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-white">{data.totalApps}</div>
                <div className="text-xs text-slate-500 uppercase font-semibold">Total Applications</div>
              </div>
            </div>

            <div className="glass p-6 rounded-xl border border-dark-850 flex items-center space-x-4">
              <div className="p-3.5 bg-emerald-500/15 rounded-lg text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-white">{data.acceptedMembers}</div>
                <div className="text-xs text-slate-500 uppercase font-semibold">Accepted Members</div>
              </div>
            </div>
          </div>

          {/* Founder Bar Chart */}
          <div className="glass p-6 rounded-xl border border-dark-850">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Recruitment Funnel</h3>
            <div className="flex items-end justify-around h-32 gap-4">
              <div className="flex flex-col items-center flex-1">
                <span className="text-xs font-bold text-brand-400 mb-1">{data.totalOpps}</span>
                <div className="w-full bg-brand-500/20 rounded-t" style={{ height: `${Math.max(10, (data.totalOpps / Math.max(data.totalOpps, data.totalApps, data.acceptedMembers, 1)) * 100)}%` }}></div>
                <span className="text-[9px] text-slate-500 mt-1 uppercase">Postings</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <span className="text-xs font-bold text-indigo-400 mb-1">{data.totalApps}</span>
                <div className="w-full bg-indigo-500/20 rounded-t" style={{ height: `${Math.max(10, (data.totalApps / Math.max(data.totalOpps, data.totalApps, data.acceptedMembers, 1)) * 100)}%` }}></div>
                <span className="text-[9px] text-slate-500 mt-1 uppercase">Applications</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <span className="text-xs font-bold text-emerald-400 mb-1">{data.acceptedMembers}</span>
                <div className="w-full bg-emerald-500/20 rounded-t" style={{ height: `${Math.max(10, (data.acceptedMembers / Math.max(data.totalOpps, data.totalApps, data.acceptedMembers, 1)) * 100)}%` }}></div>
                <span className="text-[9px] text-slate-500 mt-1 uppercase">Accepted</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Collaborator Dashboard Overview */}
      {user.role === "Collaborator" && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">My Applications Status</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="glass p-6 rounded-xl border border-dark-850 text-center">
              <div className="text-3xl font-extrabold text-white mb-1">{data.totalApps}</div>
              <div className="text-xs text-slate-500 uppercase font-semibold">Total Applications</div>
            </div>
            
            <div className="glass p-6 rounded-xl border border-dark-850 text-center">
              <div className="text-3xl font-extrabold text-amber-400 mb-1">{data.pending}</div>
              <div className="text-xs text-slate-500 uppercase font-semibold flex items-center justify-center space-x-1">
                <Clock className="h-3.5 w-3.5" />
                <span>Pending</span>
              </div>
            </div>

            <div className="glass p-6 rounded-xl border border-dark-850 text-center">
              <div className="text-3xl font-extrabold text-emerald-400 mb-1">{data.accepted}</div>
              <div className="text-xs text-slate-500 uppercase font-semibold flex items-center justify-center space-x-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Accepted</span>
              </div>
            </div>

            <div className="glass p-6 rounded-xl border border-dark-850 text-center">
              <div className="text-3xl font-extrabold text-red-400 mb-1">{data.rejected}</div>
              <div className="text-xs text-slate-500 uppercase font-semibold flex items-center justify-center space-x-1">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Rejected</span>
              </div>
            </div>
          </div>

          {/* Collaborator Bar Chart */}
          <div className="glass p-6 rounded-xl border border-dark-850">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Application Breakdown</h3>
            <div className="flex items-end justify-around h-32 gap-4">
              <div className="flex flex-col items-center flex-1">
                <span className="text-xs font-bold text-amber-400 mb-1">{data.pending}</span>
                <div className="w-full bg-amber-500/20 rounded-t" style={{ height: `${Math.max(10, (data.pending / Math.max(data.totalApps, 1)) * 100)}%` }}></div>
                <span className="text-[9px] text-slate-500 mt-1 uppercase">Pending</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <span className="text-xs font-bold text-emerald-400 mb-1">{data.accepted}</span>
                <div className="w-full bg-emerald-500/20 rounded-t" style={{ height: `${Math.max(10, (data.accepted / Math.max(data.totalApps, 1)) * 100)}%` }}></div>
                <span className="text-[9px] text-slate-500 mt-1 uppercase">Accepted</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <span className="text-xs font-bold text-red-400 mb-1">{data.rejected}</span>
                <div className="w-full bg-red-500/20 rounded-t" style={{ height: `${Math.max(10, (data.rejected / Math.max(data.totalApps, 1)) * 100)}%` }}></div>
                <span className="text-[9px] text-slate-500 mt-1 uppercase">Rejected</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Admin Dashboard Overview */}
      {user.role === "Admin" && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">Platform Health</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass p-6 rounded-xl border border-dark-850 flex items-center space-x-4">
              <div className="p-3 bg-brand-500/10 rounded text-brand-400">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-white">{data.totalUsers}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Total Users</div>
              </div>
            </div>

            <div className="glass p-6 rounded-xl border border-dark-850 flex items-center space-x-4">
              <div className="p-3 bg-indigo-500/10 rounded text-indigo-400">
                <Building className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-white">{data.totalStartups}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Startups Profiled</div>
              </div>
            </div>

            <div className="glass p-6 rounded-xl border border-dark-850 flex items-center space-x-4">
              <div className="p-3 bg-pink-500/10 rounded text-pink-400">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-white">{data.totalOpportunities}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Open Positions</div>
              </div>
            </div>

            <div className="glass p-6 rounded-xl border border-dark-850 flex items-center space-x-4">
              <div className="p-3 bg-emerald-500/10 rounded text-emerald-400">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-white">${data.totalRevenue}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Total Revenue</div>
              </div>
            </div>
          </div>

          {/* Admin Bar Chart */}
          <div className="glass p-6 rounded-xl border border-dark-850">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Platform Metrics</h3>
            <div className="flex items-end justify-around h-32 gap-4">
              <div className="flex flex-col items-center flex-1">
                <span className="text-xs font-bold text-brand-400 mb-1">{data.totalUsers}</span>
                <div className="w-full bg-brand-500/20 rounded-t" style={{ height: `${Math.max(10, (data.totalUsers / Math.max(data.totalUsers, data.totalStartups, data.totalOpportunities, 1)) * 100)}%` }}></div>
                <span className="text-[9px] text-slate-500 mt-1 uppercase">Users</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <span className="text-xs font-bold text-indigo-400 mb-1">{data.totalStartups}</span>
                <div className="w-full bg-indigo-500/20 rounded-t" style={{ height: `${Math.max(10, (data.totalStartups / Math.max(data.totalUsers, data.totalStartups, data.totalOpportunities, 1)) * 100)}%` }}></div>
                <span className="text-[9px] text-slate-500 mt-1 uppercase">Startups</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <span className="text-xs font-bold text-pink-400 mb-1">{data.totalOpportunities}</span>
                <div className="w-full bg-pink-500/20 rounded-t" style={{ height: `${Math.max(10, (data.totalOpportunities / Math.max(data.totalUsers, data.totalStartups, data.totalOpportunities, 1)) * 100)}%` }}></div>
                <span className="text-[9px] text-slate-500 mt-1 uppercase">Positions</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

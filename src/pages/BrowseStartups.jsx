import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Building, Search, ArrowRight, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import Loading from "./Loading";

import API_URL from "../api";

export default function BrowseStartups() {
  const [startups, setStartups] = useState([
    {
      _id: "1",
      startup_name: "SpaceX Gen",
      logo: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=150",
      industry: "Aerospace",
      founder_email: "founder1@tesla.com",
      founder_name: "Elon Musk",
      description: "Developing reusable orbital rockets to enable humans to become a multi-planetary species.",
      funding_stage: "Series C",
      team_size: 12,
      status: "Approved"
    },
    {
      _id: "2",
      startup_name: "HealthFlow AI",
      logo: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=150",
      industry: "Healthcare",
      founder_email: "founder2@startup.com",
      founder_name: "Jane Doe",
      description: "Leveraging machine learning to predict and optimize patient flow in regional hospitals.",
      funding_stage: "Seed",
      team_size: 5,
      status: "Approved"
    },
    {
      _id: "3",
      startup_name: "EcoCharge",
      logo: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=150",
      industry: "CleanTech",
      founder_email: "jane@ecocharge.io",
      founder_name: "Sarah Connor",
      description: "Mobile solar recharging stations for micro-mobility fleets in smart cities.",
      funding_stage: "Pre-seed",
      team_size: 6,
      status: "Approved"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3);
  const [totalCount, setTotalCount] = useState(9);

  const fetchStartups = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", 9);
      const res = await axios.get(`${API_URL}/startups?${params.toString()}`, { timeout: 5000 });
      if (res.data.success && res.data.startups?.length > 0) {
        setStartups(res.data.startups);
        setTotalPages(res.data.pagination.pages);
        setTotalCount(res.data.pagination.total);
      }
    } catch (err) {
      // API unavailable — keep default mock data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartups();
  }, [page]);

  const industries = ["All", ...new Set(startups.map((s) => s.industry))];

  const filteredStartups = startups.filter((s) => {
    const matchesSearch = s.startup_name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = selectedIndustry === "All" || s.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Building className="h-3 w-3" />
            <span>Startup Directory</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Explore Startups
          </h1>
          <p className="max-w-2xl text-slate-500 text-sm mt-1">
            Discover recently approved cohorts and companies building next-gen solutions.
          </p>
        </div>
        <div className="text-xs text-slate-500 whitespace-nowrap">
          <strong className="text-slate-400">{totalCount}</strong> startups found
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-650" />
          <input
            type="text"
            placeholder="Search startups by name, keyword or mission..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-dark-900 border border-dark-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-brand-500/60 transition-colors placeholder:text-slate-650"
          />
        </div>

        <div>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full px-4 py-2.5 bg-dark-900 border border-dark-800 rounded-lg text-sm text-slate-400 focus:outline-none focus:border-brand-500/60 transition-colors cursor-pointer"
          >
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind === "All" ? "Filter by Industry" : ind}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredStartups.length === 0 ? (
        <div className="text-center py-20 bg-dark-900/30 border border-dark-850/60 rounded-2xl">
          <div className="inline-flex p-4 rounded-2xl bg-dark-800/50 mb-4">
            <Building className="h-10 w-10 text-slate-600" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No Startups Found</h3>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">Try adjusting your filters or searching another keyword.</p>
          <button
            onClick={() => { setSearch(""); setSelectedIndustry("All"); }}
            className="mt-4 px-4 py-2 rounded-lg bg-dark-800 border border-dark-700 text-slate-300 text-xs font-semibold hover:bg-dark-700 transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredStartups.map((startup) => (
              <div
                key={startup._id}
                className="group relative glass p-6 rounded-xl border border-dark-850 hover:border-brand-500/30 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between h-[280px]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <img
                      src={startup.logo}
                      alt={startup.startup_name}
                      className="h-12 w-12 rounded-lg object-cover border border-dark-800 group-hover:border-brand-500/40 transition-colors duration-300"
                    />
                    <div className="flex items-center space-x-1.5">
                      {startup.status === "Approved" ? (
                        <>
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 px-2 py-0.5 rounded">
                            {startup.status}
                          </span>
                        </>
                      ) : (
                        <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950/20 border border-amber-500/20 px-2 py-0.5 rounded">
                          {startup.status}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors">
                    {startup.startup_name}
                  </h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
                    {startup.industry} • <span className="text-brand-400/80">{startup.funding_stage}</span>
                  </p>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {startup.description}
                  </p>
                </div>

                <div className="relative z-10 border-t border-dark-850/60 pt-4 flex items-center justify-between mt-auto">
                  <span className="text-xs text-slate-500">Team: <strong className="text-slate-400">{startup.team_size || "?"}</strong></span>
                  <Link
                    to={`/startups/${startup._id}`}
                    className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center space-x-1 group/link"
                  >
                    <span>Details</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-dark-800/60 pt-6">
              <span className="text-xs text-slate-500">
                Page <strong className="text-slate-400">{page}</strong> of <strong className="text-slate-400">{totalPages}</strong>
                <span className="hidden sm:inline"> &mdash; {totalCount} total startups</span>
              </span>
              <div className="flex items-center space-x-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-dark-800/50 border border-dark-700 hover:bg-dark-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-350 text-xs font-medium transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Previous</span>
                </button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        p === page
                          ? "bg-brand-600 text-white shadow-sm shadow-brand-600/20"
                          : "bg-dark-800/50 border border-dark-700 text-slate-400 hover:bg-dark-700"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-dark-800/50 border border-dark-700 hover:bg-dark-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-350 text-xs font-medium transition-colors cursor-pointer"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

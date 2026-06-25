import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Building, Search, ArrowRight, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import Loading from "./Loading";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function BrowseStartups() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchStartups = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", 9);
      const res = await axios.get(`${API_URL}/startups?${params.toString()}`);
      if (res.data.success) {
        setStartups(res.data.startups);
        setTotalPages(res.data.pagination.pages);
        setTotalCount(res.data.pagination.total);
      }
    } catch (err) {
      console.error("Failed to load startups, using mock data", err);
      setStartups([
        {
          _id: "1",
          startup_name: "SpaceX Gen",
          logo: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=150",
          industry: "Aerospace",
          founder_email: "founder1@tesla.com",
          founder_name: "Elon Musk",
          description: "Developing reusable orbital rockets to enable humans to become a multi-planetary species.",
          funding_stage: "Series C",
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
          status: "Approved"
        }
      ]);
      setTotalPages(1);
      setTotalCount(3);
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
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Explore Startups
        </h1>
        <p className="max-w-2xl text-slate-500 text-sm mt-1">
          Explore startup directories, review active funding stages, and connect with their founders to build together.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-650" />
          <input
            type="text"
            placeholder="Search startups by name, keyword or mission..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-dark-900 border border-dark-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-brand-500/60 transition-colors"
          />
        </div>

        <div>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full px-4 py-2.5 bg-dark-900 border border-dark-800 rounded-lg text-sm text-slate-400 focus:outline-none focus:border-brand-500/60 transition-colors"
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
        <div className="text-center py-20 bg-dark-900/50 border border-dark-850 rounded-xl">
          <Building className="h-12 w-12 text-slate-755 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">No Startups Found</h3>
          <p className="text-xs text-slate-500">Try adjusting your filters or searching another keyword.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredStartups.map((startup) => (
              <div
                key={startup._id}
                className="glass p-6 rounded-xl border border-dark-850 flex flex-col justify-between h-[280px] hover:border-brand-500/20 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <img
                      src={startup.logo}
                      alt={startup.startup_name}
                      className="h-12 w-12 rounded-lg object-cover border border-dark-800"
                    />
                    <div className="flex items-center space-x-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 px-2 py-0.5 rounded">
                        Approved
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors">
                    {startup.startup_name}
                  </h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
                    {startup.industry} • {startup.funding_stage}
                  </p>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {startup.description}
                  </p>
                </div>

                <div className="border-t border-dark-850/60 pt-4 flex items-center justify-between mt-auto">
                  <span className="text-xs text-slate-500">Contact: <strong className="text-slate-400">{startup.founder_email}</strong></span>
                  <Link
                    to={`/startups/${startup._id}`}
                    className="text-xs font-semibold text-brand-400 group-hover:text-brand-350 flex items-center space-x-1"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-dark-900 pt-6">
              <span className="text-xs text-slate-500">
                Page <strong className="text-slate-400">{page}</strong> of <strong className="text-slate-400">{totalPages}</strong> ({totalCount} startups)
              </span>
              <div className="flex space-x-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  className="p-2 rounded bg-dark-900 border border-dark-800 hover:bg-dark-850 disabled:opacity-30 disabled:cursor-not-allowed text-slate-350 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-2 rounded bg-dark-900 border border-dark-800 hover:bg-dark-850 disabled:opacity-30 disabled:cursor-not-allowed text-slate-350 cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

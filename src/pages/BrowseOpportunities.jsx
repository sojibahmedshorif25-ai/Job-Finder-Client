import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Search, Briefcase, Calendar, ChevronLeft, ChevronRight, X, SlidersHorizontal } from "lucide-react";
import Loading from "./Loading";

import API_URL from "../api";

export default function BrowseOpportunities() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { transition: { staggerChildren: 0.08 } }
  };

  const [opportunities, setOpportunities] = useState([
    {
      _id: "101",
      role_title: "Rocket Guidance Systems Engineer",
      startup_name: "SpaceX Gen",
      industry: "Aerospace",
      required_skills: ["C++", "Rust", "Control Theory", "Embedded Systems"],
      work_type: "On-site",
      commitment_level: "Full-time",
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toLocaleDateString()
    },
    {
      _id: "102",
      role_title: "React Web Developer (Mission Control)",
      startup_name: "SpaceX Gen",
      industry: "Aerospace",
      required_skills: ["React", "JavaScript", "D3.js", "Tailwind CSS"],
      work_type: "Remote",
      commitment_level: "Full-time",
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString()
    },
    {
      _id: "103",
      role_title: "Python Data Scientist (ML)",
      startup_name: "HealthFlow AI",
      industry: "Healthcare",
      required_skills: ["Python", "PyTorch", "Pandas", "Healthcare Data"],
      work_type: "Hybrid",
      commitment_level: "Part-time",
      deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toLocaleDateString()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [workType, setWorkType] = useState([]);
  const [industry, setIndustry] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3);
  const [totalCount, setTotalCount] = useState(9);

  // Hardcoded filters for sidebar
  const workTypes = ["Remote", "Hybrid", "On-site"];
  const industries = ["Aerospace", "Healthcare", "CleanTech", "Fintech", "AI/ML", "E-commerce"];

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      // Query parameters
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", 6);
      if (search) params.append("search", search);
      if (workType.length > 0) params.append("workType", workType.join(","));
      if (industry) params.append("industry", industry);

      const res = await axios.get(`${API_URL}/opportunities?${params.toString()}`, { timeout: 5000 });
      if (res.data.success && res.data.opportunities?.length > 0) {
        setOpportunities(res.data.opportunities);
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
    fetchOpportunities();
  }, [page, workType, industry]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOpportunities();
  };

  const handleWorkTypeChange = (type) => {
    setPage(1);
    if (workType.includes(type)) {
      setWorkType(workType.filter((t) => t !== type));
    } else {
      setWorkType([...workType, type]);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setWorkType([]);
    setIndustry("");
    setPage(1);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Browse Opportunities</h1>
        <p className="max-w-2xl text-slate-500 text-sm mt-1">
          Apply to build startups in return for equity, partnerships, or co-founder stakes. Filter by commitments or sectors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="glass p-6 rounded-xl border border-dark-850 space-y-6 h-fit lg:col-span-1">
          <div className="flex items-center justify-between border-b border-dark-900 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <SlidersHorizontal className="h-4 w-4 text-brand-400" />
              <span>Filters</span>
            </h2>
            {(search || workType.length > 0 || industry) && (
              <button
                onClick={clearFilters}
                className="text-[10px] font-semibold text-red-400 hover:text-red-300 transition-colors flex items-center space-x-0.5 cursor-pointer"
              >
                <X className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Filter by Work Type */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Work Type</h3>
            <div className="space-y-2">
              {workTypes.map((type) => (
                <label key={type} className="flex items-center space-x-2.5 text-sm text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={workType.includes(type)}
                    onChange={() => handleWorkTypeChange(type)}
                    className="rounded border-dark-800 bg-dark-900 text-brand-500 focus:ring-brand-500/20"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter by Industry */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Industry</h3>
            <select
              value={industry}
              onChange={(e) => {
                setPage(1);
                setIndustry(e.target.value);
              }}
              className="w-full px-3 py-2 bg-dark-900 border border-dark-800 rounded-lg text-xs text-slate-400 focus:outline-none focus:border-brand-500/60"
            >
              <option value="">All Industries</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Opportunities List Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-650" />
              <input
                type="text"
                placeholder="Search opportunities by role title or skill tags (e.g. React)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-dark-900 border border-dark-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-brand-500/60"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold tracking-wide transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Opportunities Cards */}
          {loading ? (
            <Loading />
          ) : opportunities.length === 0 ? (
            <div className="text-center py-20 bg-dark-900/50 border border-dark-850 rounded-xl">
              <Briefcase className="h-12 w-12 text-slate-755 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-1">No Opportunities Found</h3>
              <p className="text-xs text-slate-500">There are no open positions matching the specified filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {opportunities.map((opp) => (
                <motion.div
                  key={opp._id}
                  variants={fadeInUp}
                  className="glass p-6 rounded-xl border border-dark-850 flex flex-col justify-between h-[280px] hover:border-brand-500/20 transition-all duration-300 hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {opp.work_type} • {opp.commitment_level}
                      </span>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 font-semibold uppercase">
                        {opp.industry}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white leading-snug line-clamp-1">
                      {opp.role_title}
                    </h3>
                    <p className="text-xs text-brand-400 font-semibold mb-3">{opp.startup_name}</p>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {opp.required_skills.map((skill, index) => (
                        <span
                          key={index}
                          className="text-[10px] px-2 py-0.5 rounded bg-dark-900 border border-dark-800 text-slate-400"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-dark-850/60 pt-4 flex items-center justify-between mt-auto">
                    <span className="text-[10px] text-slate-500 flex items-center space-x-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Apply by: {new Date(opp.deadline).toLocaleDateString()}</span>
                    </span>
                    <Link
                      to={`/opportunities/${opp._id}`}
                      className="px-4 py-2 rounded bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold tracking-wide transition-colors"
                    >
                      View details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-dark-900 pt-6">
              <span className="text-xs text-slate-500">
                Showing page <strong className="text-slate-400">{page}</strong> of <strong className="text-slate-400">{totalPages}</strong> ({totalCount} opportunities)
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
        </div>
      </div>
    </motion.div>
  );
}

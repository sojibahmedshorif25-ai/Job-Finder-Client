import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { ArrowRight, Briefcase, Building, Users, Star, Award, Sparkles, CheckCircle2 } from "lucide-react";

import API_URL from "../api";

export default function Home() {
  const [featuredStartups, setFeaturedStartups] = useState([]);
  const [featuredOpportunities, setFeaturedOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch startups and opportunities
        const [startupsRes, oppsRes] = await Promise.all([
          axios.get(`${API_URL}/startups`),
          axios.get(`${API_URL}/opportunities?limit=3`)
        ]);

        if (startupsRes.data.success) {
          setFeaturedStartups(startupsRes.data.startups.slice(0, 3));
        }
        if (oppsRes.data.success) {
          setFeaturedOpportunities(oppsRes.data.opportunities);
        }
      } catch (err) {
        console.error("Failed to load featured data, using mock data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mock fallbacks if database is empty
  const mockStartups = [
    {
      _id: "1",
      startup_name: "AstroLaunch",
      logo: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=80&h=80",
      industry: "Aerospace",
      founder_email: "elon@astrolaunch.com",
      founder_name: "Elon Musk",
      description: "Developing automated low-orbit cargo capsules for space logistics.",
      funding_stage: "Series A",
      team_size: 8
    },
    {
      _id: "2",
      startup_name: "MedFlow AI",
      logo: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=80&h=80",
      industry: "Healthcare",
      founder_email: "jane@medflow.io",
      founder_name: "Dr. Jane Adams",
      description: "AI-powered scheduling pipelines for regional emergency rooms.",
      funding_stage: "Seed",
      team_size: 4
    },
    {
      _id: "3",
      startup_name: "GreenGrid",
      logo: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=80&h=80",
      industry: "CleanTech",
      founder_email: "carl@greengrid.net",
      founder_name: "Carl Sagan",
      description: "Decentralized energy grids sharing solar capacity across residential areas.",
      funding_stage: "Pre-seed",
      team_size: 6
    }
  ];

  const mockOpportunities = [
    {
      _id: "101",
      role_title: "Full Stack Engineer (React/Node)",
      startup_name: "AstroLaunch",
      required_skills: ["React", "Node.js", "MongoDB", "WebSockets"],
      work_type: "Remote",
      commitment_level: "Full-time",
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString()
    },
    {
      _id: "102",
      role_title: "Lead UI/UX Designer",
      startup_name: "MedFlow AI",
      required_skills: ["Figma", "Design Systems", "Prototyping"],
      work_type: "Hybrid",
      commitment_level: "Full-time",
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()
    },
    {
      _id: "103",
      role_title: "Python Data Scientist (ML)",
      startup_name: "GreenGrid",
      required_skills: ["Python", "PyTorch", "Pandas", "Scikit-Learn"],
      work_type: "Remote",
      commitment_level: "Part-time",
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()
    }
  ];

  const startups = featuredStartups.length > 0 ? featuredStartups : mockStartups;
  const opportunities = featuredOpportunities.length > 0 ? featuredOpportunities : mockOpportunities;

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Banner Section (Hero) */}
      <section className="relative overflow-hidden pt-12 md:pt-24 pb-12 flex items-center min-h-[90vh]">
        {/* Premium background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/8 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>
        
        {/* Subtle grid overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-subtle-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-white"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-subtle-grid)" />
        </svg>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-6 text-left"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              <span>Forging Next-Gen Startup Teams</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Assemble Your Dream{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-400 to-purple-400">Startup Team</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg text-slate-400 max-w-xl leading-relaxed">
              StartupForge connects visionary founders with talented co-builders, developers, designers, and specialists who want to exchange skills for impact.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <Link
                to="/opportunities"
                className="group flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-sm tracking-wide transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-brand-600/30 hover:shadow-brand-500/40"
              >
                <span>Browse Opportunities</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/startups"
                className="group flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl bg-dark-800/50 hover:bg-dark-800 text-slate-200 font-bold text-sm tracking-wide border border-dark-700 hover:border-dark-600 transition-all duration-300 hover:-translate-y-1"
              >
                <Building className="h-4 w-4" />
                <span>Explore Startups</span>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div variants={fadeInUp} className="flex items-center space-x-6 pt-4">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-dark-900" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=50&h=50" alt="" />
                <img className="w-8 h-8 rounded-full border-2 border-dark-900" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=50&h=50" alt="" />
                <img className="w-8 h-8 rounded-full border-2 border-dark-900" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=50&h=50" alt="" />
              </div>
              <div className="text-xs text-slate-500">
                <span className="text-slate-300 font-semibold">1,200+</span> professionals already connected
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-brand-600/10">
              <div className="absolute -inset-1 bg-gradient-to-b from-brand-500/20 via-purple-500/10 to-transparent rounded-2xl blur-sm pointer-events-none"></div>
              <div className="relative border border-dark-800 rounded-2xl overflow-hidden glass p-4">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                  alt="Collaborative Startup Meeting"
                  className="rounded-xl w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent"></div>

                {/* Floating badges */}
                <div className="absolute top-6 left-6 flex items-center space-x-2 px-3 py-1.5 glass rounded-lg border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs text-white font-medium">1,240 active</span>
                </div>
                <div className="absolute top-6 right-6 px-3 py-1.5 glass rounded-lg border border-white/5">
                  <span className="text-xs text-brand-400 font-bold">+40% growth</span>
                </div>
                
                {/* Bottom mini card */}
                <div className="absolute bottom-6 left-6 right-6 glass/80 p-4 rounded-xl border border-white/5 flex items-center justify-between backdrop-blur-xl">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-brand-500/20 rounded-lg text-brand-400">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-white text-xs font-semibold">Active Collaborators</div>
                      <div className="text-slate-400 text-xs">Connecting founders &amp; builders</div>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    <img className="w-7 h-7 rounded-full border-2 border-dark-900" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=50&h=50" alt="" />
                    <img className="w-7 h-7 rounded-full border-2 border-dark-900" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=50&h=50" alt="" />
                    <img className="w-7 h-7 rounded-full border-2 border-dark-900" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=50&h=50" alt="" />
                    <div className="w-7 h-7 rounded-full border-2 border-dark-900 bg-brand-600 flex items-center justify-center text-[9px] text-white font-bold">+12</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Dynamic Section 1: Featured Startups */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Featured Startups</h2>
            <p className="text-sm text-slate-500 mt-1">Discover recently approved cohorts and companies building next-gen solutions.</p>
          </div>
          <Link to="/startups" className="mt-4 md:mt-0 flex items-center space-x-1 text-sm font-semibold text-brand-400 hover:text-brand-300">
            <span>View all startups</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {startups.map((startup) => (
            <motion.div
              key={startup._id}
              variants={fadeInUp}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative glass p-6 rounded-xl border border-dark-850 hover:border-brand-500/30 transition-all duration-300 flex flex-col justify-between h-[280px]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <img
                    src={startup.logo}
                    alt={startup.startup_name}
                    className="h-12 w-12 rounded-lg object-cover border border-dark-800 group-hover:border-brand-500/40 transition-colors duration-300"
                  />
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-medium">
                    {startup.funding_stage}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-brand-200 transition-colors">{startup.startup_name}</h3>
                <p className="text-xs text-slate-400 mb-2">Founded by: {startup.founder_name || "Startup Founder"}</p>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{startup.description}</p>
                <p className="text-xs text-slate-500 mt-2">Team Size: <strong className="text-slate-350">{startup.team_size || "TBD"}</strong></p>
              </div>

              <div className="relative z-10 border-t border-dark-850/60 pt-4 flex items-center justify-between mt-auto">
                <span className="text-xs text-slate-500">Industry: <strong className="text-slate-350">{startup.industry}</strong></span>
                <Link
                  to={`/startups/${startup._id}`}
                  className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center space-x-1 group/link"
                >
                  <span>Profile</span>
                  <ArrowRight className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 3. Dynamic Section 2: Featured Opportunities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Featured Opportunities</h2>
            <p className="text-sm text-slate-500 mt-1">Apply to high-impact projects matching your tech stack.</p>
          </div>
          <Link to="/opportunities" className="mt-4 md:mt-0 flex items-center space-x-1 text-sm font-semibold text-brand-400 hover:text-brand-300">
            <span>View all opportunities</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {opportunities.map((opp) => (
            <motion.div
              key={opp._id}
              variants={fadeInUp}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative glass p-6 rounded-xl border border-dark-850 hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between h-[300px]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-indigo-400" />
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{opp.work_type}</span>
                  </div>
                  <span className="text-[10px] text-red-400 bg-red-950/20 border border-red-500/25 px-2 py-0.5 rounded font-semibold uppercase">
                    {new Date(opp.deadline).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-0.5 line-clamp-1 group-hover:text-indigo-200 transition-colors">{opp.role_title}</h3>
                <p className="text-xs text-indigo-400 font-semibold mb-3">{opp.startup_name}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {opp.required_skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="text-[10px] px-2 py-0.5 rounded bg-dark-900 border border-dark-800 text-slate-400 group-hover:border-indigo-500/20 transition-colors">
                      {skill}
                    </span>
                  ))}
                  {opp.required_skills.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 text-slate-600">+{opp.required_skills.length - 3} more</span>
                  )}
                </div>
              </div>

              <div className="relative z-10 border-t border-dark-850/60 pt-4 flex items-center justify-between mt-auto">
                <span className="text-xs text-slate-500">Commitment: <strong className="text-slate-350">{opp.commitment_level}</strong></span>
                <Link
                  to={`/opportunities/${opp._id}`}
                  className="px-3.5 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold tracking-wide transition-all hover:-translate-y-0.5 shadow-lg shadow-indigo-600/20"
                >
                  Apply
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 4. Startup Statistics */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900/50 to-dark-950 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { value: "150+", label: "Startups Profiled", color: "from-brand-400 to-brand-600" },
              { value: "450+", label: "Opportunities Listed", color: "from-indigo-400 to-indigo-600" },
              { value: "1,200+", label: "Applications Filed", color: "from-pink-400 to-pink-600" },
              { value: "$5.8M+", label: "Capital Seeded", color: "from-emerald-400 to-emerald-600" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="group relative glass p-6 rounded-2xl border border-dark-800 hover:border-dark-700 transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-2xl pointer-events-none"></div>
                <div className={`text-3xl sm:text-4xl font-extrabold bg-gradient-to-b ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white tracking-tight">How It Works</h2>
            <p className="text-sm text-slate-500 mt-2">From vision to velocity in three simple steps.</p>
          </motion.div>
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px bg-gradient-to-r from-brand-500/40 via-indigo-500/40 to-pink-500/40"></div>
          <div className="hidden md:block absolute top-[4.25rem] left-[calc(16.66%+2rem)] w-2 h-2 rounded-full bg-brand-400"></div>
          <div className="hidden md:block absolute top-[4.25rem] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-400"></div>
          <div className="hidden md:block absolute top-[4.25rem] right-[calc(16.66%+2rem)] w-2 h-2 rounded-full bg-pink-400"></div>

          {[
            { icon: Building, num: "01", title: "Register Your Role", desc: "Sign up as a Founder or Collaborator. Build your profile and showcase your skills or vision.", color: "brand", delay: 0 },
            { icon: Briefcase, num: "02", title: "Connect & Apply", desc: "Founders post opportunities. Collaborators browse, apply, and match with teams that excite them.", color: "indigo", delay: 0.15 },
            { icon: Award, num: "03", title: "Build & Launch", desc: "Once matched, forge ahead together. Exchange equity, skills, and build something extraordinary.", color: "pink", delay: 0.3 },
          ].map((step, i) => {
            const colorMap = {
              brand: { bg: "bg-brand-500/10", border: "border-brand-500/20", text: "text-brand-400", num: "text-brand-400" },
              indigo: { bg: "bg-indigo-500/10", border: "border-indigo-500/20", text: "text-indigo-400", num: "text-indigo-400" },
              pink: { bg: "bg-pink-500/10", border: "border-pink-500/20", text: "text-pink-400", num: "text-pink-400" },
            };
            const c = colorMap[step.color];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: step.delay, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="group relative text-center p-8 rounded-2xl border border-dark-800/60 hover:border-dark-700 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-2xl pointer-events-none group-hover:opacity-100 transition-opacity"></div>
                <div className={`relative inline-flex p-4 rounded-2xl ${c.bg} ${c.border} border mb-5 group-hover:scale-105 transition-transform duration-300`}>
                  <step.icon className={`h-7 w-7 ${c.text}`} />
                </div>
                <div className="relative text-2xl font-extrabold text-white mb-1">
                  <span className={c.num}>{step.num}</span>
                </div>
                <h3 className="relative text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="relative text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 6. Success Stories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white tracking-tight">Success Stories</h2>
            <p className="text-sm text-slate-500 mt-2">Hear from founders who filled critical roles and builders who secured their next challenge.</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              icon: Star,
              name: "Sarah Jenkins",
              role: "Founder of EcoRoute",
              img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100",
              quote: "We had reached our free limit of 3 opportunity posts and upgraded to Premium via Stripe. That same week, we posted our lead React engineer listing and matched with Alex within 48 hours. The skill-match was 100% accurate!",
              color: "brand",
              delay: 0,
            },
            {
              icon: Award,
              name: "David Chen",
              role: "Full-Stack Collaborator",
              img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100",
              quote: "I applied for the Machine Learning position at HealthFlow. The interface is completely reload-safe, the portfolio linking was smooth, and I received real-time updates directly on my dashboard when my status changed from pending to accepted.",
              color: "indigo",
              delay: 0.15,
            },
          ].map((story, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: story.delay, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="group relative glass p-8 rounded-2xl border border-dark-800 hover:border-dark-700 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent rounded-2xl pointer-events-none"></div>
              <story.icon className="absolute top-8 right-8 h-5 w-5 text-slate-600 group-hover:text-brand-400 transition-colors duration-300" />
              <div className="relative flex items-center space-x-4 mb-6">
                <div className="relative">
                  <img
                    src={story.img}
                    alt={story.name}
                    className="h-14 w-14 rounded-full object-cover border-2 border-brand-500/20 group-hover:border-brand-500/40 transition-all duration-300"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-dark-900"></div>
                </div>
                <div>
                  <h4 className="text-white font-bold group-hover:text-brand-200 transition-colors">{story.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">{story.role}</p>
                </div>
              </div>
              <p className="relative text-slate-400 text-sm leading-relaxed italic group-hover:text-slate-300 transition-colors">
                &ldquo;{story.quote}&rdquo;
              </p>
              <div className="relative mt-4 flex space-x-1">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} className="w-3.5 h-3.5 text-amber-400 fill-amber-400/80" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 7. CTA Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-dark-800 p-12 md:p-16 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-indigo-600/5 to-purple-600/10 pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
              Ready to Build the Next Big Thing?
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-8">
              Join thousands of founders and collaborators who are forging the future of startups — one team at a time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                to="/register"
                className="flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold text-sm tracking-wide transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-brand-600/30"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/startups"
                className="flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-dark-800/50 hover:bg-dark-800 text-slate-200 font-bold text-sm tracking-wide border border-dark-700 hover:border-dark-600 transition-all duration-300 hover:-translate-y-1"
              >
                <Building className="h-4 w-4" />
                <span>Browse Startups</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

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
      <section className="relative overflow-hidden pt-12 md:pt-24 pb-12 flex items-center min-h-[85vh]">
        {/* Dynamic Background Gradients */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="relative space-y-6 text-left"
          >
            {/* Background image behind text */}
            <div className="absolute -inset-20 pointer-events-none overflow-hidden rounded-3xl">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                alt=""
                className="w-full h-full object-cover opacity-[0.08]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/95 to-dark-950/80"></div>
            </div>
            <motion.div variants={fadeInUp} className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              <span>Forging Next-Gen Startup Teams</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Assemble Your Dream <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-400">Startup Team</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg text-slate-450 max-w-xl">
              StartupForge connects visionary founders with talented co-builders, developers, designers, and specialists who want to exchange skills for impact.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <Link
                to="/opportunities"
                className="flex items-center justify-center space-x-2 px-6 py-3.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm tracking-wide transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-brand-600/30"
              >
                <span>Browse Opportunities</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/startups"
                className="flex items-center justify-center space-x-2 px-6 py-3.5 rounded-lg bg-dark-900 hover:bg-dark-850 text-slate-200 font-bold text-sm tracking-wide border border-dark-800 transition-all duration-300"
              >
                <Building className="h-4 w-4" />
                <span>Explore Startups</span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="relative border border-dark-800 rounded-2xl overflow-hidden glass p-4 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                alt="Collaborative Startup Meeting"
                className="rounded-xl w-full h-[380px] object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-80"></div>
              
              {/* Overlapping mini card */}
              <div className="absolute bottom-8 left-8 right-8 glass p-4 rounded-xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-brand-500/20 rounded-lg text-brand-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-white text-xs font-semibold">Active Collaborators</div>
                    <div className="text-slate-400 text-xs">1,240 professionals matching today</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs px-2 py-1 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 font-bold">
                    +40% growth
                  </span>
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

      {/* 4. Additional Section 1: Startup Statistics */}
      <section className="bg-dark-950 py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-y from-dark-900/10 via-dark-900/50 to-dark-950 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="glass p-6 rounded-xl border border-dark-850">
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-400 mb-1">150+</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Startups Profiled</div>
            </div>
            <div className="glass p-6 rounded-xl border border-dark-850">
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400 mb-1">450+</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Opportunities Listed</div>
            </div>
            <div className="glass p-6 rounded-xl border border-dark-850">
              <div className="text-3xl sm:text-4xl font-extrabold text-pink-400 mb-1">1,200+</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Applications Filed</div>
            </div>
            <div className="glass p-6 rounded-xl border border-dark-850">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mb-1">$5.8M+</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Capital Seeded</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white tracking-tight">How It Works</h2>
          <p className="text-sm text-slate-500 mt-2">From vision to velocity in three simple steps.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0, duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 mb-5">
              <Building className="h-7 w-7 text-brand-400" />
            </div>
            <div className="text-2xl font-extrabold text-white mb-1">
              <span className="text-brand-400">01</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Register Your Role</h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">Sign up as a Founder or Collaborator. Build your profile and showcase your skills or vision.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-5">
              <Briefcase className="h-7 w-7 text-indigo-400" />
            </div>
            <div className="text-2xl font-extrabold text-white mb-1">
              <span className="text-indigo-400">02</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Connect & Apply</h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">Founders post opportunities. Collaborators browse, apply, and match with teams that excite them.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex p-4 rounded-2xl bg-pink-500/10 border border-pink-500/20 mb-5">
              <Award className="h-7 w-7 text-pink-400" />
            </div>
            <div className="text-2xl font-extrabold text-white mb-1">
              <span className="text-pink-400">03</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Build & Launch</h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">Once matched, forge ahead together. Exchange equity, skills, and build something extraordinary.</p>
          </motion.div>
        </div>
      </section>

      {/* 6. Additional Section: Success Stories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white tracking-tight">Success Stories</h2>
          <p className="text-sm text-slate-500 mt-2">Hear from founders who filled critical roles and builders who secured their next challenge.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass p-8 rounded-xl border border-dark-850 relative">
            <Star className="absolute top-8 right-8 h-5 w-5 text-brand-400 fill-brand-400/20" />
            <div className="flex items-center space-x-4 mb-6">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100"
                alt="Sarah Jenkins"
                className="h-14 w-14 rounded-full border border-brand-500/25 object-cover"
              />
              <div>
                <h4 className="text-white font-bold">Sarah Jenkins</h4>
                <p className="text-xs text-brand-400 font-medium">Founder of EcoRoute</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed italic">
              "We had reached our free limit of 3 opportunity posts and upgraded to Premium via Stripe. That same week, we posted our lead React engineer listing and matched with Alex within 48 hours. The skill-match was 100% accurate!"
            </p>
          </div>

          <div className="glass p-8 rounded-xl border border-dark-850 relative">
            <Award className="absolute top-8 right-8 h-5 w-5 text-indigo-400 fill-indigo-400/20" />
            <div className="flex items-center space-x-4 mb-6">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100"
                alt="David Chen"
                className="h-14 w-14 rounded-full border border-brand-500/25 object-cover"
              />
              <div>
                <h4 className="text-white font-bold">David Chen</h4>
                <p className="text-xs text-brand-400 font-medium">Full-Stack Collaborator</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed italic">
              "I applied for the Machine Learning position at HealthFlow. The interface is completely reload-safe, the portfolio linking was smooth, and I received real-time updates directly on my dashboard when my status changed from pending to accepted."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

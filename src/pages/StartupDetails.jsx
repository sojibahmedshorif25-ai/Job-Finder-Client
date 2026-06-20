import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Building, Mail, Award, CheckCircle, Calendar, Briefcase } from "lucide-react";
import Loading from "./Loading";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function StartupDetails() {
  const { id } = useParams();
  const [startup, setStartup] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        // Fetch startup details
        const startupRes = await axios.get(`${API_URL}/startups/${id}`);
        if (startupRes.data.success) {
          setStartup(startupRes.data.startup);
        }

        // Fetch opportunities and filter by startup_id
        const oppsRes = await axios.get(`${API_URL}/opportunities`);
        if (oppsRes.data.success) {
          const filtered = oppsRes.data.opportunities.filter(
            (opp) => opp.startup_id === id
          );
          setOpportunities(filtered);
        }
      } catch (err) {
        console.error("Failed to load details, using mock fallback", err);
        // Mock fallback
        const mockStartups = {
          "1": {
            _id: "1",
            startup_name: "SpaceX Gen",
            logo: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=150",
            industry: "Aerospace",
            founder_email: "founder1@tesla.com",
            founder_name: "Elon Musk",
            description: "SpaceX Gen designs, manufactures and launches advanced rockets and spacecraft. The company was founded in 2002 to revolutionize space technology, with the ultimate goal of enabling people to live on other planets. We look for passionate builders who aren't afraid of complex physics, aerospace mechanics, and full-stack control software.",
            funding_stage: "Series C"
          },
          "2": {
            _id: "2",
            startup_name: "HealthFlow AI",
            logo: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=150",
            industry: "Healthcare",
            founder_email: "founder2@startup.com",
            founder_name: "Jane Doe",
            description: "HealthFlow AI optimizes healthcare scheduling pipelines. Our core technology integrates with hospital databases to predict surge periods and match staff availability automatically. We are backed by Y-Combinator and seeking builders who want to fix real-world medical logistics.",
            funding_stage: "Seed"
          }
        };

        const mockOpps = [
          {
            _id: "101",
            startup_id: "1",
            role_title: "Rocket Guidance Systems Engineer",
            startup_name: "SpaceX Gen",
            required_skills: ["C++", "Rust", "Control Theory", "Embedded Systems"],
            work_type: "On-site",
            commitment_level: "Full-time",
            deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toLocaleDateString()
          },
          {
            _id: "102",
            startup_id: "1",
            role_title: "React Web Developer (Mission Control)",
            startup_name: "SpaceX Gen",
            required_skills: ["React", "JavaScript", "D3.js", "Tailwind CSS"],
            work_type: "Remote",
            commitment_level: "Full-time",
            deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString()
          },
          {
            _id: "103",
            startup_id: "2",
            role_title: "Python Data Scientist (ML)",
            startup_name: "HealthFlow AI",
            required_skills: ["Python", "PyTorch", "Pandas", "Healthcare Data"],
            work_type: "Hybrid",
            commitment_level: "Part-time",
            deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toLocaleDateString()
          }
        ];

        setStartup(mockStartups[id] || mockStartups["1"]);
        setOpportunities(mockOpps.filter((o) => o.startup_id === id));
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <Loading />;
  if (!startup) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white">Startup Not Found</h2>
        <Link to="/startups" className="text-brand-400 mt-4 inline-block hover:underline">
          Back to all startups
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <div>
        <Link
          to="/startups"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Startups</span>
        </Link>
      </div>

      {/* Startup Header Info */}
      <div className="glass p-8 rounded-2xl border border-dark-850 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-brand-500/5 rounded-full blur-[40px] pointer-events-none"></div>

        <img
          src={startup.logo}
          alt={startup.startup_name}
          className="h-24 w-24 rounded-2xl object-cover border-2 border-dark-800 shadow-xl"
        />

        <div className="space-y-3 flex-grow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {startup.startup_name}
            </h1>
            <div className="flex justify-center space-x-2">
              <span className="text-[10px] uppercase font-bold text-brand-400 bg-brand-950/20 border border-brand-500/20 px-2.5 py-1 rounded">
                {startup.funding_stage}
              </span>
              <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-950/20 border border-indigo-500/20 px-2.5 py-1 rounded">
                {startup.industry}
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
            {startup.description}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 pt-2 text-xs text-slate-500">
            <div className="flex items-center justify-center sm:justify-start space-x-1.5">
              <Mail className="h-4 w-4 text-brand-500" />
              <span>Contact: {startup.founder_email}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start space-x-1.5">
              <Award className="h-4 w-4 text-indigo-500" />
              <span>Founder: {startup.founder_name || "Platform Member"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Open Opportunities */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2 border-b border-dark-900 pb-3">
          <Briefcase className="h-5 w-5 text-brand-500" />
          <span>Active Opportunities ({opportunities.length})</span>
        </h2>

        {opportunities.length === 0 ? (
          <div className="text-center py-10 bg-dark-900/30 border border-dark-850 rounded-xl text-slate-500 text-sm">
            This startup does not currently have any active co-founder or collaborator openings. Check back later!
          </div>
        ) : (
          <div className="space-y-4">
            {opportunities.map((opp) => (
              <div
                key={opp._id}
                className="glass p-6 rounded-xl border border-dark-850 hover:border-brand-500/20 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white">{opp.role_title}</h3>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-dark-900 text-slate-400 border border-dark-800">
                      {opp.work_type}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-dark-900 text-slate-400 border border-dark-800">
                      {opp.commitment_level}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {opp.required_skills.map((skill, index) => (
                      <span key={index} className="text-[10px] px-2 py-0.5 rounded bg-brand-500/5 border border-brand-500/10 text-brand-400">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-end gap-2 border-t md:border-t-0 border-dark-850 pt-3 md:pt-0">
                  <span className="text-[10px] text-slate-500 flex items-center space-x-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Apply before: {new Date(opp.deadline).toLocaleDateString()}</span>
                  </span>
                  <Link
                    to={`/opportunities/${opp._id}`}
                    className="px-4 py-2 rounded bg-brand-650 hover:bg-brand-600 text-white text-xs font-semibold tracking-wide transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

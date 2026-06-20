import React from "react";
import { Link } from "react-router-dom";
import { Rocket, Mail, Phone, MapPin, Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark-950 border-t border-dark-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Info */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 text-white font-extrabold text-xl tracking-tight mb-4">
              <Rocket className="h-6 w-6 text-brand-500" />
              <span>
                Startup<span className="text-brand-500">Forge</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 mt-2">
              Accelerating innovation by bridging the gap between visionaries and builders. Join a team, build your dreams.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/startups" className="hover:text-white transition-colors">
                  Browse Startups
                </Link>
              </li>
              <li>
                <Link to="/opportunities" className="hover:text-white transition-colors">
                  Browse Opportunities
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-brand-500" />
                <span className="hover:text-white transition-colors">support@startupforge.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-brand-500" />
                <span>+1 (555) 019-2834</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-brand-500" />
                <span>One Hacker Way, Menlo Park, CA</span>
              </li>
            </ul>
          </div>

          {/* Socials & Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="hover:text-white transition-colors p-2 bg-dark-905 rounded-full border border-dark-850 hover:border-brand-500/40">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="hover:text-white transition-colors p-2 bg-dark-905 rounded-full border border-dark-850 hover:border-brand-500/40">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="hover:text-white transition-colors p-2 bg-dark-905 rounded-full border border-dark-850 hover:border-brand-500/40">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
            <p className="text-xs text-slate-650">
              © {new Date().getFullYear()} StartupForge. All rights reserved. Made for visionaries.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

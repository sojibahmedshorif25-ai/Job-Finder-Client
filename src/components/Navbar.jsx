import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, Rocket, LogOut, LayoutDashboard, User, Sparkles } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      navigate("/");
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Startups", path: "/startups" },
    { name: "Opportunities", path: "/opportunities" }
  ];

  const activeStyle = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
      isActive
        ? "text-brand-400 bg-dark-800 border border-brand-500/20 shadow-sm shadow-brand-500/5"
        : "text-slate-400 hover:text-white hover:bg-dark-800/50"
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-dark-950/80 border-b border-dark-800/60 shadow-lg shadow-dark-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="group flex items-center space-x-2.5">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-500/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
                <Rocket className="relative h-6 w-6 text-brand-400 group-hover:text-brand-300 transition-colors" />
              </div>
              <span className="text-white font-extrabold text-xl tracking-tight">
                Startup<span className="text-brand-400 group-hover:text-brand-300 transition-colors">Forge</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path} className={activeStyle}>
                {link.name}
              </NavLink>
            ))}

            {user ? (
              <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-dark-800">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4 text-brand-500" />
                  <span>Dashboard</span>
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <div className="absolute inset-0 bg-brand-500/10 rounded-full blur-sm"></div>
                      <img
                        src={user.image}
                        alt={user.name}
                        className="relative h-8 w-8 rounded-full border-2 border-brand-500/40 object-cover"
                      />
                    </div>
                    <div className="hidden lg:block">
                      <div className="text-sm font-medium text-slate-200 leading-tight">{user.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{user.role}</div>
                    </div>
                  </div>
                  <span className="hidden lg:inline-flex text-[10px] px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-bold uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-dark-800/50 border border-red-500/15 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-6">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md text-sm font-semibold bg-brand-600 text-white hover:bg-brand-500 shadow-md shadow-brand-600/20 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-dark-900 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-dark-950/95 border-b border-dark-850 px-2 pt-2 pb-4 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-dark-900"
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <div className="pt-4 border-t border-dark-800 mt-4 space-y-2">
              <div className="flex items-center px-3 space-x-3">
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-10 w-10 rounded-full border border-brand-500 object-cover"
                />
                <div>
                  <div className="text-base font-medium text-white">{user.name}</div>
                  <div className="text-sm font-medium text-slate-400">{user.email}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-dark-900"
                >
                  <LayoutDashboard className="h-5 w-5 text-brand-500" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 border-t border-dark-800 mt-4 flex flex-col space-y-2 px-3">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-dark-900"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2 rounded-md text-base font-semibold bg-brand-650 text-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

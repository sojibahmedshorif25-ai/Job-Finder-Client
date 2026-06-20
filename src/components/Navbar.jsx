import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, Rocket, LogOut, LayoutDashboard, User } from "lucide-react";

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
    { name: "Browse Startups", path: "/startups" },
    { name: "Browse Opportunities", path: "/opportunities" }
  ];

  const activeStyle = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
      isActive
        ? "text-brand-400 bg-dark-800 border border-brand-500/20"
        : "text-slate-400 hover:text-white hover:bg-dark-900"
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass border-b border-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-white font-extrabold text-xl tracking-tight hover:opacity-90 transition-opacity">
              <Rocket className="h-6 w-6 text-brand-500 animate-pulse" />
              <span>
                Startup<span className="text-brand-500">Forge</span>
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
                <div className="flex items-center space-x-2">
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-8 w-8 rounded-full border border-brand-500 object-cover"
                  />
                  <span className="text-sm font-medium text-slate-300 hidden lg:inline">{user.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-semibold uppercase">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-dark-900 border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <LogOut className="h-3 w-3" />
                  <span>Logout</span>
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

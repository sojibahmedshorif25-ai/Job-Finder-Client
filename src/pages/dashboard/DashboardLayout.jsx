import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  Rocket, Menu, X, LogOut, LayoutDashboard, Building, PlusCircle, 
  Briefcase, FolderGit, User, Users, ShieldAlert, CreditCard, ChevronRight 
} from "lucide-react";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      navigate("/");
    }
  };

  // Define sidebar navigation items based on user roles
  const founderLinks = [
    { name: "Overview", path: "/dashboard/overview", icon: LayoutDashboard },
    { name: "My Startup", path: "/dashboard/my-startup", icon: Building },
    { name: "Add Opportunity", path: "/dashboard/add-opportunity", icon: PlusCircle },
    { name: "Manage Postings", path: "/dashboard/manage-opportunities", icon: Briefcase },
    { name: "Applications Received", path: "/dashboard/applications", icon: FolderGit },
    { name: "Edit Profile", path: "/dashboard/profile", icon: User }
  ];

  const collaboratorLinks = [
    { name: "Overview", path: "/dashboard/overview", icon: LayoutDashboard },
    { name: "My Applications", path: "/dashboard/my-applications", icon: FolderGit },
    { name: "Update Profile", path: "/dashboard/profile", icon: User }
  ];

  const adminLinks = [
    { name: "Overview", path: "/dashboard/overview", icon: LayoutDashboard },
    { name: "Manage Users", path: "/dashboard/manage-users", icon: Users },
    { name: "Manage Startups", path: "/dashboard/manage-startups", icon: Building },
    { name: "Transactions Logs", path: "/dashboard/transactions", icon: CreditCard }
  ];

  const getLinksByRole = () => {
    if (user?.role === "Founder") return founderLinks;
    if (user?.role === "Collaborator") return collaboratorLinks;
    if (user?.role === "Admin") return adminLinks;
    return [];
  };

  const activeLinkStyle = ({ isActive }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-brand-600 text-white shadow-md shadow-brand-650/20"
        : "text-slate-400 hover:text-white hover:bg-dark-900"
    }`;

  const navLinks = getLinksByRole();

  return (
    <div className="flex min-h-screen bg-dark-950 text-slate-200">
      {/* 1. Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 border-r border-dark-900 shrink-0 bg-dark-950/80 glass-premium">
        {/* Branding header */}
        <div className="h-16 flex items-center px-6 border-b border-dark-900">
          <Link to="/" className="flex items-center space-x-2 text-white font-extrabold text-lg tracking-tight">
            <Rocket className="h-5 w-5 text-brand-500" />
            <span>
              Startup<span className="text-brand-500">Forge</span>
            </span>
          </Link>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-dark-900/60 flex items-center space-x-3">
          <img
            src={user?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80"}
            alt={user?.name}
            className="h-10 w-10 rounded-full border border-brand-500/30 object-cover"
          />
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-white truncate">{user?.name}</h4>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-bold uppercase tracking-wider block w-fit mt-1">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Links Navigation */}
        <nav className="flex-grow p-4 space-y-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink key={link.path} to={link.path} className={activeLinkStyle}>
                <Icon className="h-4 w-4 shrink-0" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-dark-900">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. Responsive Side Panel Drawer on Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          {/* Overlay backdrop */}
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          ></div>

          {/* Drawer Sidebar */}
          <div className="relative flex flex-col w-64 bg-dark-950 border-r border-dark-900 text-slate-200 z-50 animate-fade-in">
            <div className="h-16 flex items-center justify-between px-6 border-b border-dark-900">
              <Link to="/" className="flex items-center space-x-2 text-white font-extrabold text-lg">
                <Rocket className="h-5 w-5 text-brand-500" />
                <span>StartupForge</span>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 border-b border-dark-900/60 flex items-center space-x-3">
              <img
                src={user?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80"}
                alt={user?.name}
                className="h-10 w-10 rounded-full border border-brand-500/30 object-cover"
              />
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-white truncate">{user?.name}</h4>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 font-bold uppercase block w-fit mt-1">
                  {user?.role}
                </span>
              </div>
            </div>

            <nav className="flex-grow p-4 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setSidebarOpen(false)}
                    className={activeLinkStyle}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{link.name}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="p-4 border-t border-dark-900">
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  handleLogout();
                }}
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Dashboard Window */}
      <div className="flex-grow flex flex-col min-h-screen overflow-x-hidden">
        {/* Mobile Header Bar */}
        <header className="h-16 border-b border-dark-900/60 lg:border-b-0 px-6 flex items-center justify-between lg:justify-end shrink-0 glass bg-dark-950/20 lg:bg-transparent">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-dark-900 lg:hidden focus:outline-none"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-4">
            <span className="text-xs text-slate-400 font-medium hidden md:inline">Logged in: {user?.email}</span>
            <Link to="/" className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-dark-800 hover:bg-dark-900 text-slate-300 transition-colors">
              Exit to Home
            </Link>
          </div>
        </header>

        {/* Router Outlet for Dashboard pages */}
        <main className="flex-grow p-6 sm:p-8 md:p-10 max-w-6xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

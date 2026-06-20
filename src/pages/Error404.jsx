import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function Error404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 text-center bg-dark-950 text-slate-200">
      {/* 404 Illustration */}
      <div className="relative mb-8">
        <h1 className="text-9xl font-black tracking-widest text-slate-800 animate-pulse selection:bg-transparent">
          404
        </h1>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold uppercase tracking-widest text-brand-500 bg-dark-950 px-4 py-2 border border-brand-500/20 rounded-md">
          Lost in Orbit
        </span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
        Page Not Found
      </h2>
      
      <p className="max-w-md text-slate-500 text-sm mb-8">
        The startup idea you are looking for has either pivoted, or this link never existed in our ecosystem. Double check the URL or head back home.
      </p>

      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <Link
          to="/"
          className="flex items-center justify-center space-x-2 px-5 py-3 rounded-md bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 shadow-md shadow-brand-600/20"
        >
          <Home className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center space-x-2 px-5 py-3 rounded-md bg-dark-900 hover:bg-dark-850 text-slate-300 font-semibold text-sm border border-dark-800 transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
}

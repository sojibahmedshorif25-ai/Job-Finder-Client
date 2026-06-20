import React from "react";
import { Rocket } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full bg-dark-950 text-slate-200">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-500"></div>
        {/* Inner spinning ring */}
        <div className="absolute animate-ping h-8 w-8 rounded-full bg-brand-500/20"></div>
        <Rocket className="absolute h-6 w-6 text-brand-400" />
      </div>
      <p className="mt-6 text-sm font-medium text-slate-400 tracking-widest animate-pulse uppercase">
        Forging Connection...
      </p>
    </div>
  );
}

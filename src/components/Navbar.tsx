import React from 'react';
import { NavLink } from 'react-router-dom';
import { Lock, Shield, LayoutDashboard, Terminal, MessageSquare, Info } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  return (
    <header className="border-b border-white/10 p-4 md:p-6 flex flex-col md:flex-row items-center justify-between bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <NavLink to="/" className="flex items-center gap-3 mb-4 md:mb-0">
        <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/50">
          <Lock className="text-green-500 w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-bold tracking-tighter uppercase italic">PHISHGUARD_OS</h1>
          <p className="text-[8px] md:text-[10px] text-white/40 uppercase tracking-widest font-mono">E-Banking Security Hub</p>
        </div>
      </NavLink>

      <nav className="flex items-center gap-2 md:gap-6 font-mono text-[10px] md:text-xs uppercase tracking-widest">
        <NavLink 
          to="/" 
          className={({ isActive }) => cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg transition-all border border-transparent",
            isActive ? "bg-green-500/10 text-green-500 border-green-500/30" : "hover:text-green-500 text-white/50"
          )}
        >
          <LayoutDashboard size={14} />
          <span className="hidden sm:inline">Overview</span>
        </NavLink>
        <NavLink 
          to="/scanner" 
          className={({ isActive }) => cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg transition-all border border-transparent",
            isActive ? "bg-green-500/10 text-green-500 border-green-500/30" : "hover:text-green-500 text-white/50"
          )}
        >
          <Shield size={14} />
          <span className="hidden sm:inline">Scanner</span>
        </NavLink>
        <NavLink 
          to="/assistant" 
          className={({ isActive }) => cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg transition-all border border-transparent",
            isActive ? "bg-green-500/10 text-green-500 border-green-500/30" : "hover:text-green-500 text-white/50"
          )}
        >
          <MessageSquare size={14} />
          <span className="hidden sm:inline">AI Assistant</span>
        </NavLink>
        <NavLink 
          to="/logs" 
          className={({ isActive }) => cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg transition-all border border-transparent",
            isActive ? "bg-green-500/10 text-green-500 border-green-500/30" : "hover:text-green-500 text-white/50"
          )}
        >
          <Terminal size={14} />
          <span className="hidden sm:inline">Logs</span>
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;

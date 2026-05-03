/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Scanner from './components/Scanner';
import Assistant from './components/Assistant';
import LogsPage from './components/LogsPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen technical-grid flex flex-col font-sans selection:bg-green-500/30">
        <Navbar />
        
        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/logs" element={<LogsPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="p-6 border-t border-white/10 flex items-center justify-between text-[8px] md:text-[10px]">
          <div className="text-white/30 italic uppercase tracking-widest flex items-center gap-2 md:gap-4 font-mono">
            <span>&copy; 2024 PhishGuard Security</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-green-500/50 hidden sm:inline">SECURE_CHANNEL_ENCRYPTED</span>
          </div>
          <div className="flex gap-4 md:gap-6 uppercase tracking-widest text-white/40 italic font-mono">
            <a href="#" className="hover:text-green-500 transition-colors">Docs</a>
            <a href="#" className="hover:text-green-500 transition-colors">API</a>
            <a href="#" className="hover:text-green-500 transition-colors">Support</a>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

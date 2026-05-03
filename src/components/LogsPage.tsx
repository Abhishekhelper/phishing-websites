import React, { useState, useEffect } from 'react';
import { Terminal, Database, Trash2, Search, ExternalLink, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ClassificationReport, ClassificationResult } from '../types';
import { HighlightedUrl } from './Scanner';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const LogsPage = () => {
  const [history, setHistory] = useState<ClassificationReport[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('phishguard_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const clearLogs = () => {
    if (window.confirm('Wipe historical data? Initializing memory purge...')) {
      setHistory([]);
      localStorage.removeItem('phishguard_history');
    }
  };

  const getStatusIcon = (result: ClassificationResult) => {
    switch (result) {
      case ClassificationResult.PHISHING: return <ShieldAlert size={16} className="text-red-500" />;
      case ClassificationResult.LEGITIMATE: return <ShieldCheck size={16} className="text-green-500" />;
      case ClassificationResult.SUSPICIOUS: return <ShieldQuestion size={16} className="text-yellow-500" />;
      default: return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-20 font-mono"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter uppercase flex items-center gap-3">
            <Terminal className="text-green-500" />
            INVESTIGATION_LOGS
          </h2>
          <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Audit trail of classified e-banking entities</p>
        </div>
        <button 
          onClick={clearLogs}
          disabled={history.length === 0}
          className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-[10px] font-bold text-red-500 uppercase hover:bg-red-500 hover:text-white transition-all disabled:opacity-30 flex items-center gap-2"
        >
          <Trash2 size={12} />
          WIPE_MEMORY_CACHE
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {history.length === 0 ? (
          <div className="py-20 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center opacity-20">
            <Database size={48} className="mb-4" />
            <p className="uppercase tracking-[0.3em] italic text-sm">NO_DATA_FOUND</p>
          </div>
        ) : (
          history.map((log, i) => (
            <motion.div 
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-2xl bg-[#121214] border border-white/10 hover:border-green-500/30 transition-all group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex items-center gap-4 shrink-0">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center border",
                    log.result === ClassificationResult.PHISHING ? "bg-red-500/5 border-red-500/20" : 
                    log.result === ClassificationResult.LEGITIMATE ? "bg-green-500/5 border-green-500/20" : "bg-yellow-500/5 border-yellow-500/20"
                  )}>
                    {getStatusIcon(log.result)}
                  </div>
                  <div>
                    <p className={cn(
                      "text-[10px] font-black italic uppercase tracking-widest",
                      log.result === ClassificationResult.PHISHING ? "text-red-500" : 
                      log.result === ClassificationResult.LEGITIMATE ? "text-green-500" : "text-yellow-500"
                    )}>
                      {log.result}
                    </p>
                    <p className="text-[10px] text-white/30 uppercase mt-0.5">
                      {new Date(log.timestamp).toLocaleDateString()} // {new Date(log.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                   <div className="text-sm font-bold truncate group-hover:text-green-500 transition-colors">
                      <HighlightedUrl url={log.url} />
                   </div>
                   <p className="text-[10px] text-white/40 mt-1 italic line-clamp-1">{log.reasoning}</p>
                </div>

                <div className="flex items-center gap-6 shrink-0 lg:border-l lg:border-white/5 lg:pl-6">
                  <div className="text-center">
                    <p className="text-[9px] text-white/20 uppercase font-black italic">Risk</p>
                    <p className={cn("text-xl font-black italic", log.riskScore > 60 ? "text-red-500" : "text-green-500")}>{log.riskScore}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] text-white/20 uppercase font-black italic">Conf.</p>
                    <p className="text-xl font-black italic opacity-60">{log.confidence}%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default LogsPage;

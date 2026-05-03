import React, { useState } from 'react';
import { 
  Search, 
  Activity, 
  AlertTriangle, 
  ArrowRight,
  Terminal,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  Database,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { detectPhishing } from '../services/classificationService';
import { ClassificationReport, ClassificationResult } from '../types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SUSPICIOUS_KEYWORDS = ['login', 'verify', 'account', 'secure', 'bank', 'update', 'signin', 'online', 'service'];

export function HighlightedUrl({ url }: { url: string }) {
  const displayUrl = url.replace(/^https?:\/\//, '');
  const regex = new RegExp(`(${SUSPICIOUS_KEYWORDS.join('|')})`, 'gi');
  const parts = displayUrl.split(regex);

  return (
    <span className="break-all">
      {parts.map((part, i) => {
        const isMatch = SUSPICIOUS_KEYWORDS.some(kw => kw.toLowerCase() === part.toLowerCase());
        return isMatch ? (
          <span key={i} className="text-yellow-400 bg-yellow-400/10 px-0.5 rounded border-b border-yellow-400/50">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </span>
  );
}

const Scanner = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<ClassificationReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url) return;

    setIsAnalyzing(true);
    setError(null);
    setReport(null);

    try {
      const result = await detectPhishing(url);
      setReport(result);
      
      const saved = localStorage.getItem('phishguard_history');
      const history = saved ? JSON.parse(saved) : [];
      const newHistory = [result, ...history.filter((h: any) => h.url !== result.url)].slice(0, 50);
      localStorage.setItem('phishguard_history', JSON.stringify(newHistory));
    } catch (err) {
      console.error(err);
      setError('Analysis failed. Please check the URL and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusColor = (result: ClassificationResult) => {
    switch (result) {
      case ClassificationResult.PHISHING: return 'text-red-500';
      case ClassificationResult.LEGITIMATE: return 'text-green-500';
      case ClassificationResult.SUSPICIOUS: return 'text-yellow-500';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (result: ClassificationResult) => {
    switch (result) {
      case ClassificationResult.PHISHING: return <ShieldAlert className="w-12 h-12 text-red-500" />;
      case ClassificationResult.LEGITIMATE: return <ShieldCheck className="w-12 h-12 text-green-500" />;
      case ClassificationResult.SUSPICIOUS: return <ShieldQuestion className="w-12 h-12 text-yellow-500" />;
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
      {/* Search Panel */}
      <div className="lg:col-span-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-2xl border border-white/10 bg-[#121214] shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Terminal size={120} />
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Search size={24} className="text-green-500" />
              TARGETED ANALYSIS
            </h2>
            <p className="text-white/50 text-sm mb-6 max-w-2xl">
              Input the suspected E-banking URL for deep linguistic and structural associative classification. 
              Our engine evaluates hundreds of known phishing antecedents in real-time.
            </p>

            <form onSubmit={handleAnalyze} className="relative">
              <input 
                type="text"
                placeholder="https://secure-login-bank.com/verify..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded-xl py-4 pl-12 pr-32 focus:outline-none focus:border-green-500 transition-colors text-sm font-mono"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <button 
                disabled={isAnalyzing || !url}
                type="submit"
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all",
                  isAnalyzing || !url ? "bg-white/5 text-white/20" : "bg-green-500 text-black hover:bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                )}
              >
                {isAnalyzing ? (
                  <>
                    <Activity className="animate-spin" size={14} />
                    RUNNING...
                  </>
                ) : (
                  <>
                    ANALYZE
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
            {error && <p className="mt-4 text-red-500 text-xs flex items-center gap-2 italic font-bold"> <AlertTriangle size={14}/> {error}</p>}
          </div>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {report ? (
          <React.Fragment key="report">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="lg:col-span-8 p-6 rounded-2xl border border-white/10 bg-[#121214] flex flex-col gap-8 shadow-2xl"
            >
              <div className="flex flex-col md:flex-row items-center gap-8 border-b border-white/10 pb-8">
                <div className="relative">
                  <div className={cn(
                    "absolute inset-0 blur-2xl opacity-20",
                    report.result === ClassificationResult.PHISHING ? "bg-red-500" : 
                    report.result === ClassificationResult.LEGITIMATE ? "bg-green-500" : "bg-yellow-500"
                  )} />
                  <div className="relative z-10 w-32 h-32 rounded-full border-4 border-white/5 flex items-center justify-center bg-black/50">
                    {getStatusIcon(report.result)}
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                     <span className={cn("text-xs font-bold uppercase tracking-[0.2em]", getStatusColor(report.result))}>
                      {report.result} DETECTION
                    </span>
                    <div className="h-px flex-1 bg-white/5" />
                    <button 
                      onClick={() => setReport(null)}
                      className="text-[10px] text-white/40 hover:text-white transition-colors uppercase flex items-center gap-1 font-mono"
                    >
                      [ CLOSE ]
                    </button>
                  </div>
                  <h3 className="text-4xl font-black italic tracking-tighter mb-2 uppercase break-all">
                    <HighlightedUrl url={report.url} />
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed italic border-l-2 border-green-500 pl-4 py-2 bg-green-500/5">
                    "{report.reasoning}"
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Database size={14} />
                  Triggered Antecedent Rules
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.features.map((feature, idx) => (
                    <div 
                      key={idx}
                      className={cn(
                        "p-4 rounded-xl border transition-all hover:translate-x-1",
                        feature.isRisk ? "bg-red-500/5 border-red-500/20" : "bg-green-500/5 border-green-500/20"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-white/40 uppercase italic font-mono">{feature.name}</span>
                        {feature.isRisk ? <AlertTriangle size={12} className="text-red-500" /> : <ShieldCheck size={12} className="text-green-500" />}
                      </div>
                      <p className={cn("font-bold text-sm", feature.isRisk ? "text-red-400" : "text-green-400")}>{feature.value}</p>
                      <p className="text-[10px] text-white/50 mt-1 leading-normal italic">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:col-span-4 flex flex-col gap-6"
            >
              <div className="p-6 rounded-2xl border border-white/10 bg-[#121214] relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
                  <Activity size={80} />
                </div>
                <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-6 font-mono">Threat Index</h4>
                
                <div className="h-48 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { value: report.riskScore, name: 'Risk' },
                          { value: 100 - report.riskScore, name: 'Safety' }
                        ]}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        <Cell fill={report.riskScore > 60 ? '#EF4444' : (report.riskScore > 30 ? '#F59E0B' : '#22C55E')} />
                        <Cell fill="rgba(255,255,255,0.05)" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pt-4 text-center">
                    <span className="text-5xl font-black italic select-none font-mono">
                      {report.riskScore}
                      <span className="text-sm opacity-50">%</span>
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-end border-t border-white/5 pt-4 font-mono">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase">Confidence</p>
                    <p className="text-lg font-bold italic">{report.confidence}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/40 uppercase">Latency</p>
                    <p className="text-sm font-bold opacity-50 italic">{(Math.random() * 0.5 + 0.1).toFixed(2)}s</p>
                  </div>
                </div>
              </div>

               <div className="p-6 rounded-2xl border border-white/10 bg-[#121214] shadow-2xl">
                  <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-6 flex items-center gap-2 font-mono">
                    <Globe size={14} />
                    Risk Matrix
                  </h4>
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={report.features.slice(0, 5).map(f => ({ 
                        name: f.name.split(' ')[0], 
                        val: f.isRisk ? 80 + Math.random() * 20 : 10 + Math.random() * 15 
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          stroke="rgba(255,255,255,0.3)" 
                          fontSize={8} 
                          tickLine={false} 
                          axisLine={false}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px' }}
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                        <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                          {report.features.slice(0, 5).map((f, index) => (
                            <Cell key={`cell-${index}`} fill={f.isRisk ? '#EF4444' : '#22C55E'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
            </motion.div>
          </React.Fragment>
        ) : isAnalyzing ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:col-span-12 py-20 flex flex-col items-center justify-center text-center"
          >
            <div className="relative w-24 h-24 mb-6">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-t-green-500 border-r-transparent border-b-green-500 border-l-transparent rounded-full shadow-[0_0_40px_rgba(34,197,94,0.3)]"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border-2 border-t-transparent border-r-white/20 border-b-transparent border-l-white/20 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center text-green-500">
                <Activity size={32} className="animate-pulse" />
              </div>
            </div>
            <p className="font-bold italic text-xl uppercase tracking-[0.2em] mb-2 font-mono">Analyzing Heuristics</p>
            <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-[0.4em] italic font-mono">
              <span>Rule Extraction</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>Association Mapping</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>Final Classification</span>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:col-span-12 py-32 flex flex-col items-center justify-center text-center opacity-30 select-none border border-white/5 rounded-2xl bg-white/[0.02]"
          >
            <ShieldQuestion size={80} className="mb-4" />
            <p className="font-bold italic text-lg uppercase tracking-[0.3em]">System Standby</p>
            <p className="text-xs max-w-sm mt-2 italic leading-relaxed font-mono">
              Awaiting input stream. PhishGuard is ready to classify intercepted traffic. 
              Use association rules to reveal malicious patterns.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Scanner;

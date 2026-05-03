import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Activity, Globe, Zap, AlertTriangle, ArrowRight, BarChart3, Fingerprint } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="space-y-24 py-12 font-mono">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none -rotate-12 translate-x-12">
          <Shield size={400} />
        </div>
        
        <div className="relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-500 text-[10px] font-black uppercase tracking-[0.3em] rounded-full">System v2.4.0 Online</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.9]">
              DECODING <span className="text-green-500">PHISHING</span><br />
              INTELLIGENCE
            </h1>
            <p className="mt-8 text-lg text-white/50 max-w-2xl leading-relaxed italic">
              Experience the next generation of E-banking security. PhishGuard uses sophisticated 
              <span className="text-white"> Associative Classification</span> heuristics to identify malicious 
              entities before they compromise your digital identity.
            </p>
            
            <div className="mt-12 flex flex-wrap gap-4">
              <Link 
                to="/scanner" 
                className="px-8 py-4 bg-green-500 text-black font-black uppercase tracking-widest italic rounded-xl hover:bg-green-400 transition-all shadow-[0_0_30px_rgba(34,197,94,0.3)] flex items-center gap-3"
              >
                INITIALIZE SCANNER
                <ArrowRight size={20} />
              </Link>
              <Link 
                to="/assistant" 
                className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest italic rounded-xl hover:bg-white/10 transition-all flex items-center gap-3"
              >
                AI_CONSULTATION
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <Fingerprint className="text-green-500" />, title: "Pattern Linking", desc: "Maps URL structural anomalies to known malicious behavioral sets." },
          { icon: <Activity className="text-green-500" />, title: "Real-time Heuristics", desc: "Dynamic analysis of redirection depth and cross-domain persistence." },
          { icon: <Zap className="text-green-500" />, title: "AI Classification", desc: "Leveraging neural networks to classify complex obfuscation tactics." },
          { icon: <BarChart3 className="text-green-500" />, title: "Statistical Integrity", desc: "Confidence-weighted reporting based on verified threat databases." }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-2x border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all group"
          >
            <div className="mb-6 p-3 bg-green-500/10 rounded-xl w-fit group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <h3 className="text-sm font-black uppercase italic tracking-widest mb-3">{item.title}</h3>
            <p className="text-xs text-white/40 leading-relaxed italic">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Global Stats Simulation */}
      <section className="p-12 rounded-3xl border border-white/10 bg-black/40 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(34,197,94,0.05),transparent)] pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
          <div className="flex-1">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">GLOBAL_SECURITY_SNAPSHOT</h2>
            <p className="text-sm text-white/40 leading-relaxed italic mb-8">
              Analysis of aggregate data across our distributed detection nodes reveals a 14% increase in 
              homoglyph-based obfuscation attacks this quarter.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] text-white/20 uppercase font-black italic mb-1">Threats Neutralized</p>
                <p className="text-4xl font-black italic text-green-500">128.4K+</p>
              </div>
              <div>
                <p className="text-[10px] text-white/20 uppercase font-black italic mb-1">Mean Latency</p>
                <p className="text-4xl font-black italic text-white/80">0.34s</p>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
             <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-center gap-4">
               <AlertTriangle className="text-red-500 shrink-0" size={24} />
               <div>
                  <p className="text-[10px] font-black uppercase text-red-500 mb-0.5">Alert Level: Elevated</p>
                  <p className="text-[9px] text-white/40 leading-normal italic">High frequency of mobile-based phishing targeting Tier 1 banks.</p>
               </div>
             </div>
             <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5 flex items-center gap-4">
               <Shield className="text-green-500 shrink-0" size={24} />
               <div>
                  <p className="text-[10px] font-black uppercase text-green-500 mb-0.5">Protocol Status: Optimal</p>
                  <p className="text-[9px] text-white/40 leading-normal italic">Associative classifying engines responding within normal parameters.</p>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* QR Code / Mobile Access Section */}
      <section className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] flex flex-col md:flex-row items-center gap-8">
        <div className="bg-white p-4 rounded-2xl shrink-0 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent('https://ais-pre-m46hvwixuaonca2hnzcj3r-891400440182.asia-southeast1.run.app')}`}
            alt="Website QR Code"
            className="w-32 h-32"
          />
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">MOBILE_SYNC_READY</h3>
          <p className="text-sm text-white/40 leading-relaxed italic mb-4 max-w-md">
            Scan this code to access PhishGuard on your mobile device. Our classification engine is fully optimized for portable telecommunications hardware.
          </p>
          <div className="flex items-center gap-2 text-[10px] text-green-500 font-bold uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-full w-fit mx-auto md:mx-0">
            <Globe size={12} />
            LIVE_PREVIEW_ACTIVE
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <footer className="text-center py-12 border-t border-white/5 opacity-30 text-[10px] uppercase font-black tracking-[0.5em] italic">
        Distributed Classification Infrastructure // [NODE: AIS-SOUTH-01]
      </footer>
    </div>
  );
};

export default Home;

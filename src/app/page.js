"use client";
import Link from "next/link";
import { Trophy, Calendar, Users, ChevronRight, Gauge, ShieldAlert } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-red-600">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[90vh] flex items-center overflow-hidden border-b border-zinc-900">
        
        {/* VIDEO CONTAINER - Ensured z-0 and muted for autoplay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/30 z-10" />
          
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover grayscale opacity-40"
          >
            {/* Verify file is at public/videos/video.mp4 */}
            <source src="/videos/video.mp4" type="video/mp4" />
            <div className="absolute inset-0 bg-zinc-900" />
          </video>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-10 w-full">
          <div className="inline-flex items-center gap-3 mb-6 bg-red-600/10 border border-red-600/20 px-4 py-2 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-red-500 font-black uppercase italic tracking-widest text-[10px]">Championship Live</span>
          </div>
          
          {/* UPDATED HERO TEXT */}
          <h1 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.85] mb-8">
            TNMG <br />
            <span className="text-red-600">RACING LEAGUE</span>
          </h1>
          
          <p className="max-w-xl text-zinc-300 font-bold uppercase italic tracking-tight text-lg mb-10 leading-relaxed drop-shadow-lg">
            Join the elite grid of the TNMG ACC World Challenge. Real physics. Real stakes. Pure competition.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/events" className="bg-red-600 hover:bg-white hover:text-black text-white px-10 py-5 font-black uppercase italic tracking-tighter text-xl transition-all flex items-center gap-3 group shadow-2xl shadow-red-900/40">
              Race Calendar <ChevronRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link href="/profile" className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 hover:border-zinc-500 text-white px-10 py-5 font-black uppercase italic tracking-tighter text-xl transition-all">
              Driver Hub
            </Link>
          </div>
        </div>
      </section>

      {/* 2. BROADCAST STATS BAR */}
      <section className="bg-black border-b border-zinc-900 py-12 px-10 relative overflow-hidden text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          <StatBox label="Drivers Online" value="1.2K" icon={<Users size={16}/>} />
          <StatBox label="Green Flag %" value="94.8" icon={<Gauge size={16}/>} />
          <StatBox label="Active Rounds" value="12" icon={<Trophy size={16}/>} />
          <StatBox label="Avg SA Rating" value="88" icon={<ShieldAlert size={16}/>} />
        </div>
      </section>

      {/* 3. FEATURE TILES */}
      <section className="max-w-7xl mx-auto px-10 py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
          <FeatureCard 
            title="Elite Stewarding"
            desc="Automated lap tracking combined with human race direction ensures maximum fairness in every corner."
            link="/rules"
            btnText="Sporting Code"
          />
          <FeatureCard 
            title="Telemetry Sync"
            desc="Our ingestion engine processes raw ACC server data to provide instant performance analysis."
            link="/standings"
            btnText="Leaderboards"
          />
      </section>

      {/* 4. FOOTER CTA */}
      <section className="py-40 px-10 bg-zinc-950 border-t border-zinc-900 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-red-600" />
        <h2 className="text-6xl font-black uppercase italic tracking-tighter mb-8 mt-12 text-white">Ready to take the flag?</h2>
        <Link href="/api/auth/signin" className="inline-block bg-white text-black px-20 py-7 font-black uppercase italic tracking-tighter text-3xl hover:bg-red-600 hover:text-white transition-all transform hover:scale-105 duration-300">
          Steam Login
        </Link>
      </section>
    </div>
  );
}

function StatBox({ label, value, icon }) {
  return (
    <div className="group cursor-default">
      <div className="flex items-center gap-2 text-zinc-500 font-black uppercase italic tracking-[0.2em] text-[10px] mb-2 group-hover:text-red-600 transition-colors">
        {icon} {label}
      </div>
      <div className="text-5xl font-black italic tracking-tighter group-hover:scale-110 transition-transform origin-left text-white">
        {value}
      </div>
    </div>
  );
}

function FeatureCard({ title, desc, link, btnText }) {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800 p-16 rounded-[2.5rem] group hover:border-red-600/50 transition-all duration-700 relative overflow-hidden text-left">
      <div className="absolute -bottom-10 -right-10 text-red-600 opacity-5 group-hover:opacity-10 transition-opacity">
        <Trophy size={200} />
      </div>
      <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-6 relative z-10 text-white">{title}</h3>
      <p className="text-zinc-400 font-bold leading-relaxed mb-10 uppercase text-xs tracking-widest relative z-10">{desc}</p>
      <Link href={link} className="inline-flex items-center gap-3 font-black uppercase italic text-sm tracking-widest text-red-600 hover:text-white transition-colors relative z-10">
        {btnText} <ChevronRight size={16} />
      </Link>
    </div>
  );
}
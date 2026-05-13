"use client";
import { useSession } from "next-auth/react";
import { User, Trophy, Gauge, ShieldCheck, History, Target, Award, AlertCircle, Timer, Activity } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white italic font-black uppercase tracking-widest">Syncing Driver Profile...</div>
  );

  if (!session) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white text-center p-6">
      <p className="uppercase font-black italic text-xl">Please login via Steam to view your TNMG Profile.</p>
    </div>
  );

  return (
    <div className="min-h-screen relative text-white pb-20">
      {/* 1. THE BACKGROUND LAYER: Ensure this is the very first element */}
      <div className="fixed inset-0 -z-10">
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90 z-10" />
        {/* The ACC Image: Using a direct high-res link */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url('https://cdn.akamai.steamstatic.com/steam/apps/805550/ss_752a200787e9c5658e65e648a73926861591f4f5.1920x1080.jpg?t=1715082103')` 
          }} 
        />
      </div>

      {/* 2. THE CONTENT LAYER */}
      <div className="max-w-7xl mx-auto px-6 pt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Driver Card with enhanced Glassmorphism */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-950/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sticky top-24 shadow-2xl">
              <div className="relative w-full aspect-square bg-zinc-800 rounded-2xl mb-8 overflow-hidden border-2 border-red-600/20 group">
                {session.user.image ? (
                  <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/50 backdrop-blur-sm"><User size={80} className="text-zinc-800" /></div>
                )}
                <div className="absolute top-4 right-4 bg-red-600 px-3 py-1 rounded-sm text-[10px] font-black italic uppercase shadow-lg">Pro-AM</div>
              </div>
              
              <div className="mb-8">
                <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-tight text-white break-words">{session.user.name}</h1>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Official Entry #00</p>
              </div>
              
              <div className="space-y-4">
                 <ProfileDetail label="Status" value="Verified" color="text-green-500" />
                 <ProfileDetail label="League ID" value={session.user.steamId?.slice(-8) || "000000"} />
                 <ProfileDetail label="Member Since" value="May 2024" />
              </div>

              <div className="mt-8 pt-8 border-t border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Safety Rating</span>
                  <span className="text-2xl font-black italic text-red-600">S+</span>
                </div>
                <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden"><div className="bg-red-600 h-full w-[95%]" /></div>
              </div>
            </div>
          </div>

          {/* Performance Dashboard */}
          <div className="lg:col-span-3 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PerformanceCard icon={<Trophy />} label="Season Points" value="284" trend="+12" />
              <PerformanceCard icon={<Target />} label="Podiums" value="12" trend="+1" />
              <PerformanceCard icon={<Timer />} label="Avg Qualy" value="P3" trend="-0.4" />
            </div>

            <div className="bg-zinc-950/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-3">
                  <History className="text-red-600" size={20} />
                  <h3 className="font-black uppercase italic tracking-tight text-xl text-white">Championship History</h3>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-black/40 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 border-b border-white/5">
                      <th className="px-8 py-5">Track / Event</th>
                      <th className="px-8 py-5">Class</th>
                      <th className="px-8 py-5">Qualy</th>
                      <th className="px-8 py-5">Finish</th>
                      <th className="px-8 py-5 text-right">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <HistoryRow track="Kyalami Grand Prix" cat="GT3" q="P1" f="P1" pts="+25" win />
                    <HistoryRow track="Suzuka 10 Hours" cat="GT3" q="P4" f="P3" pts="+15" />
                    <HistoryRow track="Mount Panorama" cat="GT3" q="P2" f="P2" pts="+18" />
                    <HistoryRow track="Monza Sprint" cat="GT3" q="P8" f="P12" pts="+0" />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PerformanceCard({ icon, label, value, trend }) {
  return (
    <div className="bg-zinc-950/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl group hover:border-red-600/50 transition-all duration-500">
      <div className="flex justify-between items-center mb-6">
        <div className="bg-black/50 p-3 rounded-xl text-red-600">{icon}</div>
        <span className="text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-2 py-1 rounded-sm">{trend}</span>
      </div>
      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-5xl font-black italic tracking-tighter group-hover:scale-105 transition-transform origin-left">{value}</h3>
    </div>
  );
}

function ProfileDetail({ label, value, color="text-zinc-400" }) {
  return (
    <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
      <span className="text-zinc-600">{label}</span><span className={color}>{value}</span>
    </div>
  );
}

function HistoryRow({ track, cat, q, f, pts, win = false }) {
  return (
    <tr className="group hover:bg-white/[0.05] transition-colors">
      <td className="px-8 py-6 flex items-center gap-3">
        <Activity size={14} className={win ? 'text-red-600' : 'text-zinc-700'} />
        <span className="font-black italic uppercase tracking-tight text-white">{track}</span>
      </td>
      <td className="px-8 py-6 text-zinc-500 text-[10px] font-black uppercase">{cat}</td>
      <td className="px-8 py-6 text-zinc-300 font-bold italic">{q}</td>
      <td className={`px-8 py-6 font-black italic ${win ? 'text-red-600 text-lg' : 'text-white'}`}>{f}</td>
      <td className="px-8 py-6 text-right font-black italic text-zinc-400 group-hover:text-red-600">{pts}</td>
    </tr>
  );
}
"use client";
import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { 
  Clock, 
  Shield, 
  Users, 
  MapPin, 
  Trophy, 
  Hourglass, 
  ChevronLeft, 
  Calendar, 
  Info, 
  X, 
  UserCheck 
} from "lucide-react";
import Link from "next/link";

export default function EventDetails({ params }) {
  const unwrappedParams = use(params); 
  const id = unwrappedParams.id;
  
  const { data: session, status: authStatus } = useSession();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [showEntries, setShowEntries] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) throw new Error("Race Not Found");
        const data = await res.json();
        setEvent(data);
        if (session?.user?.id && data.registrations?.includes(session.user.id)) {
          setHasRegistered(true);
        }
      } catch (err) {
        setEvent(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchEvent();
  }, [id, session]);

  const handleRegister = async () => {
    if (authStatus !== "authenticated") {
      alert("Please sign in via Steam to register.");
      return;
    }

    setRegistering(true);
    try {
      const res = await fetch(`/api/events/${id}/register`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (res.ok) {
        setEvent(data);
        setHasRegistered(true);
      } else {
        alert(data.error || "Registration failed.");
      }
    } catch (err) {
      alert("Connection error.");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Hourglass className="animate-spin text-red-600" size={40} />
        <span className="text-zinc-500 font-black uppercase italic tracking-[0.3em] text-xs">Loading Race Data</span>
      </div>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 text-center">
      <h1 className="text-4xl font-black italic mb-4 uppercase tracking-tighter">Event Not Found</h1>
      <Link href="/events" className="bg-white text-black px-6 py-2 font-black italic uppercase text-xs flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all">
        <ChevronLeft size={16} /> Back to Calendar
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600">
      
      {/* HERO SECTION */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <img 
          src={`/tracks/${event.track?.toLowerCase().replace(/\s+/g, '-')}.jpg`} 
          className="w-full h-full object-cover opacity-60 scale-105"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600"; }}
          alt={event.track}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="text-left space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-red-600 text-white font-black italic uppercase text-[10px] px-3 py-1 tracking-tighter">GT3 SERIES</span>
                <span className="text-zinc-400 font-black uppercase italic tracking-[0.2em] text-[10px]">Round Phase: Open</span>
              </div>
              <h1 className="text-7xl md:text-[10rem] font-black uppercase italic tracking-tighter leading-[0.8] mb-2">
                {event.track}
              </h1>
              <div className="flex items-center gap-4 text-zinc-300 font-bold uppercase italic text-xs tracking-widest">
                <MapPin size={16} className="text-red-600" /> {event.location || "International Circuit"}
                <div className="w-1 h-1 rounded-full bg-zinc-700" />
                <Calendar size={16} className="text-red-600" /> {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATS & REGISTRATION */}
      <div className="max-w-7xl mx-auto px-8 md:px-20 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatBox icon={<Clock size={20}/>} label="RACE LENGTH" value={`${event.duration || "60"} MIN`} />
            <StatBox icon={<Shield size={20}/>} label="SERVER AUTH" value={authStatus === "authenticated" ? "VERIFIED" : "REQUIRED"} />
            
            <button 
              onClick={() => setShowEntries(true)}
              className="text-left group transition-all transform active:scale-95"
            >
              <StatBox 
                icon={<Users size={20}/>} 
                label="ENTRIES (CLICK TO VIEW)" 
                value={event.registrations?.length || "0"} 
                highlight 
              />
            </button>
          </div>

          <div className="lg:col-span-1">
            <button 
              onClick={handleRegister}
              disabled={registering || hasRegistered}
              className={`w-full h-full min-h-[120px] lg:min-h-0 flex flex-col items-center justify-center gap-2 p-6 font-black uppercase italic transition-all group border-2 ${
                hasRegistered 
                  ? "bg-emerald-600 border-emerald-500 cursor-default text-white" 
                  : "bg-white text-black border-white hover:bg-red-600 hover:text-white hover:border-red-600 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
              }`}
            >
              {registering ? (
                <Hourglass className="animate-spin" size={24} />
              ) : hasRegistered ? (
                <CheckCircleComponent size={24} />
              ) : (
                <Trophy size={24} className="group-hover:scale-125 transition-transform" />
              )}
              <span className="text-xl tracking-tighter">
                {registering ? "SYNCING..." : hasRegistered ? "REGISTERED" : "REGISTER NOW"}
              </span>
            </button>
          </div>
        </div>

        <div className="mt-12 py-8 border-t border-zinc-900 flex flex-wrap gap-12 text-zinc-500 font-black uppercase italic text-[10px] tracking-[0.2em]">
          <div className="flex items-center gap-2"><Info size={14} className="text-red-600"/> STEAM ACCOUNT LINKED</div>
          <div className="flex items-center gap-2"><Info size={14} className="text-red-600"/> LFP/LFM SYSTEM ACTIVE</div>
          <div className="flex items-center gap-2"><Info size={14} className="text-red-600"/> 24/7 PRACTICE SERVER</div>
        </div>
      </div>

      {/* MODAL */}
      {showEntries && (
        <EntryListModal 
          eventId={id} 
          onClose={() => setShowEntries(false)} 
        />
      )}
      
      <div className="h-40" />
    </div>
  );
}

// ------------------------------------------------------------------
// SUB-COMPONENTS (Defined here to avoid ReferenceErrors)
// ------------------------------------------------------------------

function EntryListModal({ eventId, onClose }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/events/${eventId}/entries`)
      .then(res => res.json())
      .then(data => {
        setEntries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [eventId]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
      <div className="bg-[#0A0A0A] border border-zinc-800 w-full max-w-2xl rounded-sm overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-zinc-900">
          <div className="flex items-center gap-3">
            <Users size={18} className="text-red-600" />
            <h2 className="font-black uppercase italic tracking-tighter text-2xl">Entry List</h2>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-2">
          {loading ? (
            <div className="py-20 text-center text-zinc-600 font-black uppercase italic animate-pulse tracking-widest text-xs">Retrieving Grid Telemetry...</div>
          ) : entries.length > 0 ? (
            entries.map((driver, idx) => (
              <div key={idx} className="flex items-center justify-between bg-zinc-900/20 p-4 border border-zinc-900 hover:border-zinc-700 transition-all">
                <div className="flex items-center gap-4">
                  <span className="text-red-600 font-black italic w-6 text-sm">#{String(idx + 1).padStart(2, '0')}</span>
                  <span className="font-black uppercase italic text-lg tracking-tight text-zinc-200">{driver.name || "Unknown Driver"}</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest italic bg-zinc-900 px-3 py-1">
                   <UserCheck size={10} className="text-emerald-500" /> Confirmed
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-zinc-700 font-black uppercase italic tracking-widest text-xs">No entries secured yet for this round</div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value, highlight }) {
  return (
    <div className="bg-[#0A0A0A] border border-zinc-900 p-8 hover:border-zinc-700 transition-all h-full">
      <div className="flex items-center gap-3 text-zinc-600 font-black uppercase italic text-[9px] tracking-[0.2em] mb-4">
        <span className="text-red-600">{icon}</span> {label}
      </div>
      <p className={`text-4xl font-black italic uppercase tracking-tighter leading-none ${highlight ? 'text-red-600' : 'text-white'}`}>
        {value}
      </p>
    </div>
  );
}

// Renamed to avoid any potential conflicts with Lucide
function CheckCircleComponent({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
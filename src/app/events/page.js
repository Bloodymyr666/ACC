"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, MapPin, Clock, Trophy, ChevronRight, Timer, BarChart3, Hourglass } from "lucide-react";

// Clean, professional timer component
function CountdownTimer({ targetDate, targetTime }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calculateTime = () => {
      if (!targetDate) return;
      try {
        const datePart = targetDate.split('T')[0];
        const timePart = targetTime ? targetTime.split(' ')[0] : '00:00';
        const [year, month, day] = datePart.split('-').map(Number);
        const [hours, minutes] = timePart.split(':').map(Number);
        const eventDateTime = new Date(year, month - 1, day, hours, minutes);
        const now = new Date();
        const diff = eventDateTime - now;

        if (diff <= 0) { setTimeLeft("RACE LIVE"); return; }
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        setTimeLeft(`${d}D ${h}H ${m}M`);
      } catch (e) { setTimeLeft("TBA"); }
    };
    calculateTime();
    const timer = setInterval(calculateTime, 60000); 
    return () => clearInterval(timer);
  }, [targetDate, targetTime]);

  return (
    <div className="flex items-center gap-2 text-red-500 font-black italic text-[10px] tracking-widest">
      <Hourglass size={10} className="animate-pulse" />
      {timeLeft || "SYNCING"}
    </div>
  );
}

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events").then(res => res.json()).then(data => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500 font-bold uppercase italic tracking-widest">
      Loading Series Schedule...
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pb-40 selection:bg-red-600">
      
      {/* PROFESSIONAL HEADER - Matching image_49667d.jpg */}
      <div className="pt-32 pb-20 px-10 max-w-7xl mx-auto border-b border-zinc-900">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="text-left">
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-4">
              RACE <span className="text-red-600">CALENDAR</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase italic tracking-[0.3em] text-[10px]">
              TNMG ACC World Challenge • 2024 Season
            </p>
          </div>
          <div className="flex items-center gap-6 pb-2">
            <div className="text-right">
              <p className="text-zinc-600 font-black uppercase text-[9px] tracking-widest mb-1">Active Rounds</p>
              <p className="text-2xl font-black italic">{events.length}</p>
            </div>
            <div className="w-[1px] h-10 bg-zinc-800" />
            <div className="text-right">
              <p className="text-zinc-600 font-black uppercase text-[9px] tracking-widest mb-1">Category</p>
              <p className="text-2xl font-black italic text-red-600">GT3</p>
            </div>
          </div>
        </div>
      </div>

      {/* EVENT LIST - Fixed Registration Links */}
      <div className="max-w-7xl mx-auto px-10 mt-12 space-y-4">
        {events.map((event, index) => {
          const dateObj = new Date(event.date);
          const day = dateObj.getDate();
          const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

          return (
            <div key={event._id || index} className="group flex flex-col lg:flex-row items-center bg-zinc-900/10 border border-zinc-900 hover:border-zinc-700 hover:bg-zinc-900/20 transition-all duration-300 rounded-sm">
              
              {/* DATE BADGE */}
              <div className="w-full lg:w-32 py-8 lg:py-0 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-zinc-900 shrink-0">
                <span className="text-red-600 font-black italic text-sm mb-1">{month}</span>
                <span className="text-4xl font-black italic tracking-tighter leading-none">{day}</span>
              </div>

              {/* TRACK IMAGE */}
              <div className="w-full lg:w-56 h-40 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700 shrink-0">
                <img 
                  src={`/tracks/${event.track.toLowerCase().replace(/\s+/g, '-')}.jpg`} 
                  alt={event.track}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600"; }}
                />
              </div>

              {/* MAIN INFO & LINK FIX */}
              <div className="flex-1 p-8 flex flex-col md:flex-row justify-between items-center gap-8 text-left">
                <div className="w-full md:w-auto">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-zinc-600 font-black italic text-[9px] uppercase tracking-widest">Round {index + 1}</span>
                    <CountdownTimer targetDate={event.date} targetTime={event.time} />
                  </div>
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-1">{event.track}</h2>
                  <div className="flex items-center gap-2 text-zinc-500 font-bold uppercase italic text-[9px] tracking-widest">
                    <MapPin size={10} className="text-red-600" /> {event.location || "International Circuit"}
                  </div>
                </div>

                <div className="flex gap-10 border-l border-zinc-900 pl-10 h-full py-2">
                  <div className="text-left">
                    <p className="text-zinc-600 font-black uppercase text-[8px] tracking-[0.2em] mb-1 italic">Green Flag</p>
                    <p className="text-sm font-black italic uppercase">{event.time || "21:00 PHT"}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-zinc-600 font-black uppercase text-[8px] tracking-[0.2em] mb-1 italic">Duration</p>
                    <p className="text-sm font-black italic uppercase">{event.duration || "60"} MIN</p>
                  </div>
                </div>

                {/* THE FIX: Pointing specifically to the dynamic event ID */}
                <Link 
                  href={`/events/${event._id}`} 
                  className="w-full md:w-auto bg-zinc-800 hover:bg-red-600 text-white px-8 py-4 font-black uppercase italic text-[10px] tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  Race Details <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
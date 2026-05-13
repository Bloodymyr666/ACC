"use client";
import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react";
import { Gauge, User, LogOut, Shield } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-[100] bg-black/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO SECTION */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-red-600 p-2 rounded-lg group-hover:rotate-12 transition-transform duration-300">
            <Gauge className="text-white" size={24} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-black italic uppercase tracking-tighter text-white">
              TNMG <span className="text-red-600">ACC</span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
              League
            </span>
          </div>
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-zinc-400">
          <Link href="/events" className="hover:text-red-600 transition-colors">Calendar</Link>
          <Link href="/leaderboard" className="hover:text-red-600 transition-colors">Standings</Link>
          {session?.user?.isAdmin && (
            <Link href="/admin" className="flex items-center gap-2 text-red-600 hover:text-white transition-colors">
              <Shield size={12} /> Steward Panel
            </Link>
          )}
        </div>

        {/* AUTH SECTION */}
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end leading-none">
                <span className="text-[10px] font-black uppercase text-white">{session.user.name}</span>
                <span className="text-[8px] font-bold uppercase text-zinc-500">Driver</span>
              </div>
              <button 
                onClick={() => signOut()}
                className="text-zinc-500 hover:text-red-600 transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => signIn("steam")}
              className="bg-zinc-900 hover:bg-red-600 text-white px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Connect Steam
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
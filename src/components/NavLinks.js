"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { LogOut, User } from 'lucide-react';

export default function NavLinks() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-6 animate-in fade-in duration-500">
        <div className="flex flex-col items-end leading-none">
          <span className="text-xs font-black uppercase text-white italic tracking-tighter">
            {session.user.name}
          </span>
          <span className="text-[8px] font-bold uppercase text-red-600 tracking-[0.2em] mt-1">
            Pro Driver
          </span>
        </div>
        <button onClick={() => signOut()} className="text-zinc-600 hover:text-white transition-colors">
          <LogOut size={18} />
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => signIn("steam")}
      className="group relative px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden transition-all hover:border-red-600"
    >
      <div className="absolute inset-0 w-0 bg-red-600 transition-all duration-300 group-hover:w-full" />
      <span className="relative z-10 text-[11px] font-black uppercase tracking-widest text-white italic group-hover:text-white flex items-center gap-2">
        Connect <span className="text-red-600 group-hover:text-white transition-colors">Steam</span>
      </span>
    </button>
  );
}
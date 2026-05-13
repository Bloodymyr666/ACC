import "./globals.css";
import { Inter } from "next/font/google";
import AuthProvider from "@/components/AuthProvider"; 
import NavLinks from "@/components/NavLinks"; 
import { Gauge } from 'lucide-react';
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TNMG ACC LEAGUE",
  description: "Assetto Corsa Competizione Racing League",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Remove bg-zinc-950 from body to allow page-specific backgrounds to show */}
      <body className={`${inter.className} bg-black text-white min-h-screen selection:bg-red-600`}>
        <AuthProvider>
          <nav className="border-b border-zinc-800 bg-black/90 backdrop-blur-xl sticky top-0 z-[100]">
            <div className="max-w-7xl mx-auto px-10 py-6 grid grid-cols-3 items-center">
              <div className="flex justify-start">
                <Link href="/" className="flex items-center gap-4 group">
                  <div className="bg-red-600 p-2.5 rounded-md group-hover:rotate-12 transition-all duration-500 shadow-xl shadow-red-900/20">
                    <Gauge className="text-white" size={24} />
                  </div>
                  <div className="flex flex-col leading-none">
                    <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
                      TNMG <span className="text-red-600">ACC</span>
                    </h1>
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">League</span>
                  </div>
                </Link>
              </div>

              <div className="flex justify-center items-center gap-12">
                <MenuLink href="/events" label="Calendar" />
                <MenuLink href="/standings" label="Standings" />
                <MenuLink href="/rules" label="Rules" />
                <MenuLink href="/profile" label="Driver Hub" />
              </div>

              <div className="flex justify-end">
                <NavLinks />
              </div>
            </div>
          </nav>
          
          {/* Ensure main doesn't have a solid background */}
          <main className="relative">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}

function MenuLink({ href, label }) {
  return (
    <Link href={href} className="text-[13px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-red-600 transition-all italic relative group">
      {label}
      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}
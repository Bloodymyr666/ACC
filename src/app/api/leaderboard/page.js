"use client";
import { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Hash } from 'lucide-react';

export default function LeaderboardPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard/data') 
    .then(res => res.json())
    .then(json => {
      setData(json);
      setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white font-black italic uppercase tracking-widest animate-pulse">Calculating Standings...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <header className="max-w-6xl mx-auto mb-16 text-center">
        <h1 className="text-7xl font-black italic uppercase tracking-tighter text-white mb-2">
          Season <span className="text-red-600">Standings</span>
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-[0.4em] text-xs">ACC World Challenge • Pro Division</p>
      </header>

      <div className="max-w-6xl mx-auto">
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/80 text-zinc-500 text-[10px] uppercase font-black tracking-widest border-b border-zinc-800">
                <th className="p-8 w-24 text-center">Rank</th>
                <th className="p-8">Driver</th>
                <th className="p-8 text-center hidden md:table-cell">Starts</th>
                <th className="p-8 text-center hidden md:table-cell">Wins</th>
                <th className="p-8 text-right text-red-600">Total Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {data.map((driver, index) => (
                <tr key={driver.steamId} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="p-8">
                    <div className="flex justify-center">
                      {index === 0 ? <Trophy className="text-yellow-500" size={28}/> : 
                       index === 1 ? <Medal className="text-zinc-400" size={24}/> :
                       index === 2 ? <Medal className="text-amber-700" size={24}/> : 
                       <span className="font-black italic text-zinc-700 text-xl">#{index + 1}</span>}
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex flex-col">
                      <span className="text-xl font-black uppercase italic tracking-tight group-hover:text-red-500 transition-colors">
                        {driver.name}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-600 tracking-tighter uppercase">{driver.steamId}</span>
                    </div>
                  </td>
                  <td className="p-8 text-center hidden md:table-cell font-bold text-zinc-400">{driver.racesCompleted}</td>
                  <td className="p-8 text-center hidden md:table-cell">
                    {driver.wins > 0 ? (
                      <div className="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-black">
                        <Star size={12} fill="currentColor"/> {driver.wins}
                      </div>
                    ) : <span className="text-zinc-800">—</span>}
                  </td>
                  <td className="p-8 text-right">
                    <span className="text-3xl font-black italic text-red-600 tracking-tighter">
                      {driver.points}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {data.length === 0 && (
            <div className="p-20 text-center text-zinc-600 uppercase font-black italic tracking-widest">
              Waiting for first race results...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
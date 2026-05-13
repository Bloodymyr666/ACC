import dbConnect from '@/lib/db';
import Result from '@/models/Result';
import { Trophy, Medal, User, Timer } from 'lucide-react';

export const revalidate = 0; // Ensure data is always fresh

export default async function StandingsPage() {
  await dbConnect();
  
  // Fetch all results, most recent first
  const results = await Result.find({}).sort({ createdAt: -1 });

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <header className="max-w-7xl mx-auto mb-16">
        <h1 className="text-6xl font-black italic uppercase tracking-tighter text-red-600 mb-2">
          Championship Standings
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">
          Official ACC World Challenge Classification
        </p>
      </header>

      <main className="max-w-7xl mx-auto space-y-20">
        {results.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-zinc-900 rounded-3xl">
            <p className="text-zinc-600 uppercase font-black italic text-2xl">No Race Data Available Yet</p>
          </div>
        ) : (
          results.map((race) => (
            <section key={race._id.toString()} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-end gap-4 mb-6 border-l-4 border-red-600 pl-6">
                <div>
                  <h2 className="text-3xl font-black uppercase italic tracking-tight">{race.track}</h2>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Session Results</p>
                </div>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-900/80 text-zinc-400 text-[10px] uppercase font-black tracking-widest">
                      <th className="p-5 w-16">Pos</th>
                      <th className="p-5">Driver</th>
                      <th className="p-5 hidden md:table-cell">Car</th>
                      <th className="p-5 text-right"><Timer size={14} className="inline mr-2"/>Best Lap</th>
                      <th className="p-5 text-right text-red-600">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {race.standings.map((driver) => (
                      <tr key={driver.steamId} className="hover:bg-red-600/5 transition-colors group">
                        <td className="p-5 font-black italic text-xl italic italic">
                          {driver.position === 1 ? <Trophy className="text-yellow-500" size={20}/> : 
                           driver.position === 2 ? <Medal className="text-zinc-400" size={20}/> :
                           driver.position === 3 ? <Medal className="text-amber-700" size={20}/> : 
                           driver.position}
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                              <User size={14}/>
                            </div>
                            <span className="font-bold uppercase tracking-tight group-hover:text-red-500 transition-colors">
                              {driver.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-5 hidden md:table-cell text-zinc-500 font-medium text-sm">
                          {driver.car}
                        </td>
                        <td className="p-5 text-right font-mono text-sm text-zinc-400">
                          {driver.bestLap}
                        </td>
                        <td className="p-5 text-right font-black italic text-xl text-red-600">
                          +{driver.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
}
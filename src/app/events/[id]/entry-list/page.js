import Link from "next/link";

async function getEvent(id) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/events/${id}`, { cache: 'no-store' });
  const json = await res.json();
  return json.data;
}

export default async function EntryListPage({ params }) {
  const { id } = await params;
  const event = await getEvent(id);

  return (
    <div className="min-h-screen bg-black py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <Link href={`/events/${id}`} className="text-zinc-600 hover:text-white text-[10px] font-black uppercase mb-12 block transition-colors">
          ← Return to Event
        </Link>
        
        <h1 className="text-5xl font-black text-white uppercase italic mb-2 tracking-tighter">
          Official <span className="text-red-600">Entry List</span>
        </h1>
        <p className="text-zinc-500 text-xs font-bold uppercase mb-10 tracking-widest">{event?.track}</p>
        
        <div className="space-y-3">
          {event?.driverDetails && event.driverDetails.length > 0 ? (
            event.driverDetails.map((driver, index) => (
              <div key={driver.steamId} className="flex justify-between items-center bg-zinc-900/50 p-5 border border-zinc-800 hover:border-red-600/50 transition-all">
                <div className="flex items-center gap-4">
                  <span className="text-red-600 font-black italic text-sm">#{index + 1}</span>
                  <span className="text-white font-bold uppercase tracking-wide">{driver.name}</span>
                </div>
                <span className="text-zinc-700 text-[9px] font-mono tracking-tighter">{driver.steamId}</span>
              </div>
            ))
          ) : (
            <div className="p-12 border border-dashed border-zinc-800 text-center text-zinc-600 text-xs uppercase font-bold italic">
              No drivers confirmed for this grid yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
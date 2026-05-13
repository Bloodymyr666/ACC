"use client";
import { useEffect, useState } from "react";

export default function EntryList({ eventId }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEntries() {
      const res = await fetch(`/api/events/${eventId}/entries`);
      const data = await res.json();
      if (data.success) setEntries(data.entries);
      setLoading(false);
    }
    fetchEntries();
  }, [eventId]);

  if (loading) return <p className="text-zinc-500 animate-pulse">Loading Entry List...</p>;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-black uppercase italic mb-4 text-red-600">
        Entry List ({entries.length})
      </h3>
      <div className="bg-zinc-900 border border-zinc-800 divide-y divide-zinc-800">
        {entries.length === 0 ? (
          <p className="p-4 text-zinc-500 italic">No drivers registered yet.</p>
        ) : (
          entries.map((steamId, index) => (
            <div key={steamId} className="p-4 flex items-center justify-between group hover:bg-zinc-800/50">
              <span className="text-zinc-500 font-mono text-sm mr-4">#{index + 1}</span>
              <span className="text-white font-bold flex-1">Driver: {steamId}</span>
              <a 
                href={`https://steamcommunity.com/profiles/${steamId}`} 
                target="_blank" 
                className="text-xs text-red-500 opacity-0 group-hover:opacity-100 transition-opacity uppercase font-black"
              >
                View Profile
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
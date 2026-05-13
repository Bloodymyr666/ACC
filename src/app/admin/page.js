"use client";
import { useState, useEffect } from 'react';
import { useSession, signIn } from "next-auth/react";
import { 
  PlusCircle, FileUp, Trophy, Calendar, MapPin, 
  Users, Clock, AlignLeft, Lock, ListChecks, 
  Timer, Trash2, Pencil, X, AlertTriangle, CheckCircle
} from "lucide-react";

// UPDATED TRACK LIST
const TRACKS = [
  "Barcelona", "Brands Hatch", "Hungaroring", "Misano", "Monza", 
  "Nürburgring", "Paul Ricard", "Silverstone", "Spa-Francochamps", 
  "Zandvoort", "Zolder"
].sort();

const inputClassName = "w-full bg-black border border-zinc-800 p-4 rounded-lg text-white outline-none transition-all focus:border-red-600 appearance-none font-bold italic text-sm text-left";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('create');
  const [notification, setNotification] = useState(null); 
  
  const [formData, setFormData] = useState({
    title: '', track: '', location: '', date: '', time: '', category: 'GT3', duration: '60', description: ''
  });

  const showNotify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  if (status === "loading") return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white italic font-black uppercase animate-pulse">Syncing Steward Panel...</div>;

  if (!session || !session.user.isAdmin) {
    return (
      <div className="h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-6 text-center">
        <Lock className="text-red-600 mb-6 animate-bounce" size={80} />
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4">Access Denied</h1>
        <button onClick={() => signIn("steam")} className="bg-red-600 text-white px-12 py-5 font-black uppercase italic tracking-tighter text-xl hover:bg-white hover:text-black transition-all">
          Authenticate via Steam
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        showNotify("Race Published Successfully!");
        setFormData({ title: '', track: '', location: '', date: '', time: '', category: 'GT3', duration: '60', description: '' });
      }
    } catch (err) { showNotify("Failed to push event", "error"); }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex relative text-left">
      {notification && (
        <div className={`fixed top-10 right-10 z-[200] flex items-center gap-4 p-5 rounded-2xl border backdrop-blur-xl animate-in slide-in-from-right duration-500 shadow-2xl ${
          notification.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-red-500/10 border-red-500/50 text-red-400'
        }`}>
          {notification.type === 'success' ? <CheckCircle size={20}/> : <AlertTriangle size={20}/>}
          <span className="font-black uppercase italic tracking-tight text-sm">{notification.msg}</span>
        </div>
      )}

      <aside className="w-80 bg-black border-r border-zinc-800 p-8 flex flex-col shrink-0">
        <div className="mb-12">
          <h2 className="text-2xl font-black italic text-red-600 uppercase tracking-tighter leading-none text-left">Steward<br/>Panel</h2>
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-2 leading-relaxed text-left">Admin: {session.user.name}</p>
        </div>
        <nav className="flex-1 space-y-2">
          <TabButton active={activeTab === 'create'} onClick={() => setActiveTab('create')} icon={<PlusCircle size={20}/>} label="Create Event" />
          <TabButton active={activeTab === 'entries'} onClick={() => setActiveTab('entries')} icon={<ListChecks size={20}/>} label="Manage Events" />
          <TabButton active={activeTab === 'results'} onClick={() => setActiveTab('results')} icon={<FileUp size={20}/>} label="Upload Results" />
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-12">
        {activeTab === 'create' && (
          <div className="max-w-5xl animate-in fade-in duration-500">
            <header className="mb-10 text-white"><h3 className="text-5xl font-black italic uppercase tracking-tighter mb-2 text-left">Race Configuration</h3></header>
            <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/20 p-10 border border-zinc-800 rounded-2xl shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormGroup label="Event Title" icon={<Trophy size={14}/>}>
                  <input type="text" required placeholder="Round 1" className={inputClassName} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                </FormGroup>
                
                <FormGroup label="Select Track" icon={<MapPin size={14}/>}>
                  <select required className={inputClassName} value={formData.track} onChange={(e) => setFormData({...formData, track: e.target.value})}>
                    <option value="">Choose a circuit...</option>
                    {TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </FormGroup>

                <FormGroup label="Location (Country)" icon={<MapPin size={14}/>}>
                  <input type="text" placeholder="e.g. Italy" className={inputClassName} value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                </FormGroup>

                <FormGroup label="Race Date" icon={<Calendar size={14}/>}>
                  <input type="date" required className={inputClassName} value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                </FormGroup>

                <FormGroup label="Start Time" icon={<Clock size={14}/>}>
                  <input type="text" placeholder="20:00 CEST" className={inputClassName} value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
                </FormGroup>

                <FormGroup label="Duration" icon={<Timer size={14}/>}>
                  <input type="text" placeholder="60 MIN" className={inputClassName} value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} />
                </FormGroup>
              </div>

              <FormGroup label="Briefing" icon={<AlignLeft size={14}/>}>
                <textarea rows="4" className={inputClassName} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </FormGroup>

              <button type="submit" className="w-full bg-red-600 py-6 font-black uppercase italic tracking-tighter text-2xl hover:bg-white hover:text-black transition-all">Push Live</button>
            </form>
          </div>
        )}

        {activeTab === 'entries' && <EntryListView showNotify={showNotify} />}
        {activeTab === 'results' && <UploadResultsView showNotify={showNotify} />}
      </main>
    </div>
  );
}

function EntryListView({ showNotify }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null); 
  const [deleteId, setDeleteId] = useState(null); 

  const fetchEvents = () => {
    setLoading(true);
    fetch('/api/events').then(res => res.json()).then(data => { setEvents(data); setLoading(false); });
  };

  useEffect(() => { fetchEvents(); }, []);

  const confirmDelete = async () => {
    const res = await fetch(`/api/events?id=${deleteId}`, { method: 'DELETE' });
    if (res.ok) {
      showNotify("Event Deleted", "error");
      setDeleteId(null);
      fetchEvents();
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/events?id=${editingEvent._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingEvent),
    });
    if (res.ok) {
      showNotify("Race Updated!");
      setEditingEvent(null);
      fetchEvents();
    }
  };

  if (loading) return <div className="text-zinc-500 uppercase font-black italic p-12 text-left">Loading...</div>;

  return (
    <div className="max-w-5xl animate-in fade-in duration-500 text-white pb-20 text-left">
      <header className="mb-12"><h3 className="text-5xl font-black italic uppercase tracking-tighter mb-2 text-left">Manage <span className="text-red-600">Events</span></h3></header>
      <div className="space-y-4">
        {events.map(event => (
          <div key={event._id} className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group hover:border-red-600 transition-all shadow-xl">
            <div className="flex items-center gap-6">
               <img 
                 src={`/tracks/${event.track.toLowerCase().replace(/\s+/g, '-')}.jpg`} 
                 className="w-20 h-20 object-cover rounded-lg grayscale group-hover:grayscale-0 transition-all" 
                 onError={(e) => e.target.src = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=200"}
               />
               <div className="text-left">
                  <h4 className="text-xl font-black uppercase italic tracking-tight mb-1">{event.title}</h4>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{event.track} • {event.location}</p>
               </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingEvent(event)} className="p-3 bg-zinc-800 hover:bg-white hover:text-black rounded-lg transition-all" title="Edit Race">
                <Pencil size={18} />
              </button>
              <button onClick={() => setDeleteId(event._id)} className="p-3 bg-zinc-800 hover:bg-red-600 text-white rounded-lg transition-all" title="Delete Race">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingEvent && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in zoom-in duration-200">
          <div className="bg-zinc-950 border border-zinc-800 p-10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button onClick={() => setEditingEvent(null)} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"><X size={24}/></button>
            <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-8 leading-none text-left">Update <span className="text-red-600">Race</span></h3>
            <form onSubmit={handleUpdate} className="space-y-6 text-left">
               <FormGroup label="Event Title"><input type="text" className={inputClassName} value={editingEvent.title} onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})} /></FormGroup>
               <div className="grid grid-cols-2 gap-4 text-left">
                 <FormGroup label="Location"><input type="text" className={inputClassName} value={editingEvent.location} onChange={(e) => setEditingEvent({...editingEvent, location: e.target.value})} /></FormGroup>
                 <FormGroup label="Start Time"><input type="text" className={inputClassName} value={editingEvent.time} onChange={(e) => setEditingEvent({...editingEvent, time: e.target.value})} /></FormGroup>
               </div>
               <div className="flex gap-4 pt-4">
                 <button type="submit" className="flex-[2] bg-red-600 py-5 font-black uppercase italic tracking-tighter hover:bg-white hover:text-black transition-all">Save Changes</button>
                 <button type="button" onClick={() => setEditingEvent(null)} className="flex-1 bg-zinc-800 py-5 font-black uppercase italic tracking-tighter">Discard</button>
               </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[300] flex items-center justify-center p-6 animate-in zoom-in duration-300">
           <div className="bg-zinc-950 border border-red-600/50 p-12 rounded-[2.5rem] max-w-md w-full text-center shadow-2xl">
              <AlertTriangle size={40} className="mx-auto mb-6 text-red-600" />
              <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4 text-white">Delete <span className="text-red-600">Race?</span></h3>
              <div className="flex flex-col gap-3">
                 <button onClick={confirmDelete} className="w-full bg-red-600 py-5 font-black uppercase italic tracking-tighter hover:bg-white hover:text-black transition-all shadow-xl">Delete</button>
                 <button onClick={() => setDeleteId(null)} className="w-full bg-zinc-800 py-5 font-black uppercase italic tracking-tighter">Cancel</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function UploadResultsView({ showNotify }) {
  const [uploading, setUploading] = useState(false);
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const res = await fetch('/api/results/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: event.target.result,
        });
        if (res.ok) showNotify("Results Successfully Ingested!");
        else showNotify("Invalid JSON format", "error");
      } catch (err) { showNotify("Upload Failed", "error"); }
      finally { setUploading(false); }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-5xl animate-in fade-in duration-500 text-left">
      <header className="mb-10 text-white text-left"><h3 className="text-5xl font-black italic uppercase tracking-tighter mb-2">Result <span className="text-red-600">Ingestion</span></h3></header>
      <div className="text-center p-24 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/10 hover:bg-zinc-900/20 hover:border-red-600/50 transition-all duration-500">
        <input type="file" accept=".json" className="hidden" id="resUp" onChange={handleFileUpload} />
        <label htmlFor="resUp" className="cursor-pointer group">
          <FileUp className={`mx-auto mb-8 transition-all duration-500 ${uploading ? 'animate-bounce text-red-600' : 'text-zinc-600 group-hover:text-red-600 group-hover:scale-110'}`} size={80} />
          <h4 className="text-3xl font-black uppercase italic text-white tracking-tighter mb-2">{uploading ? "Analyzing Telemetry..." : "Upload ACC Results"}</h4>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Select the .JSON file from your server results folder</p>
        </label>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-4 rounded transition-all ${active ? 'bg-red-600 text-white font-black shadow-lg shadow-red-900/20' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}>
      {icon} <span className="uppercase italic tracking-tighter text-sm">{label}</span>
    </button>
  );
}

function FormGroup({ label, icon, children }) {
  return (
    <div className="space-y-2 text-white text-left">
      <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] flex items-center gap-2 italic">{icon} {label}</label>
      {children}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { MapPin, Save, Check } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminLocations() {
  const [locations, setLocations] = useState({
    myLocationName: "MY PLACE",
    myCity: "San Francisco, CA",
    herLocationName: "HER PLACE",
    herCity: "New York, NY",
    distanceText: "2,572 miles",
    noteTop: "TWO PLACES. ONE DISTANCE.",
    noteBottom1: "Wait for you to come to me...",
    noteBottom2: "...but I'm always coming to you if you need me."
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLoc = async () => {
      try {
        const data = await api.getLocations();
        if (data) setLocations(data);
      } catch (e) {}
      setLoading(false);
    };
    loadLoc();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.updateLocations(locations);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400 font-semibold">Loading Locations Editor...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-[#ff2a75]" />
          Two Locations & Distance Settings
        </h1>
        <p className="text-sm text-slate-600 font-semibold mt-1">
          Configure general location names, city titles, and distance quotes.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-6 shadow-xl border border-white/80 space-y-4">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">My Location Marker Title</label>
              <input
                type="text"
                value={locations.myLocationName}
                onChange={(e) => setLocations({ ...locations, myLocationName: e.target.value })}
                className="w-full p-3 rounded-2xl bg-white border border-[#ffd0e0] text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">My City Name</label>
              <input
                type="text"
                value={locations.myCity}
                onChange={(e) => setLocations({ ...locations, myCity: e.target.value })}
                className="w-full p-3 rounded-2xl bg-white border border-[#ffd0e0] text-sm font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Her Location Marker Title</label>
              <input
                type="text"
                value={locations.herLocationName}
                onChange={(e) => setLocations({ ...locations, herLocationName: e.target.value })}
                className="w-full p-3 rounded-2xl bg-white border border-[#ffd0e0] text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Her City Name</label>
              <input
                type="text"
                value={locations.herCity}
                onChange={(e) => setLocations({ ...locations, herCity: e.target.value })}
                className="w-full p-3 rounded-2xl bg-white border border-[#ffd0e0] text-sm font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Distance Badge Text</label>
            <input
              type="text"
              value={locations.distanceText}
              onChange={(e) => setLocations({ ...locations, distanceText: e.target.value })}
              className="w-full p-3 rounded-2xl bg-white border border-[#ffd0e0] text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Bottom Quote Line 1</label>
            <input
              type="text"
              value={locations.noteBottom1}
              onChange={(e) => setLocations({ ...locations, noteBottom1: e.target.value })}
              className="w-full p-3 rounded-2xl bg-white border border-[#ffd0e0] text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Bottom Quote Line 2 (Handwritten)</label>
            <input
              type="text"
              value={locations.noteBottom2}
              onChange={(e) => setLocations({ ...locations, noteBottom2: e.target.value })}
              className="w-full p-3 rounded-2xl bg-white border border-[#ffd0e0] text-sm font-handwritten text-[#ff2a75] font-bold"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-full bg-[#ff2a75] text-white font-bold text-xs shadow-md hover:bg-[#e60067] flex items-center gap-2"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved!' : 'Save Location Settings'}
          </button>
        </form>
      </div>
    </div>
  );
}

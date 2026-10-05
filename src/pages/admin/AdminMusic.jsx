import React, { useState, useEffect } from 'react';
import { Music, Plus, Trash2 } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminMusic() {
  const [songs, setSongs] = useState([]);
  const [newSong, setNewSong] = useState({
    title: '',
    artist: '',
    audioUrl: '',
    coverUrl: '',
    duration: '3:30'
  });

  const loadSongs = async () => {
    const data = await api.getMusic();
    setSongs(data);
  };

  useEffect(() => {
    loadSongs();
  }, []);

  const handleAddSong = async (e) => {
    e.preventDefault();
    if (!newSong.title || !newSong.audioUrl) return alert('Title and Audio URL are required.');

    try {
      await api.addSong(newSong);
      setNewSong({ title: '', artist: '', audioUrl: '', coverUrl: '', duration: '3:30' });
      loadSongs();
    } catch (err) {
      alert('Failed to add song: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete song from boombox playlist?')) return;
    await api.deleteSong(id);
    loadSongs();
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <Music className="w-6 h-6 text-[#ff2a75]" />
          Soundtrack & Boombox Playlist
        </h1>
        <p className="text-sm text-slate-600 font-semibold mt-1">
          Add or remove special songs from the interactive boombox.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-6 shadow-xl border border-white/80 space-y-4">
        <h2 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
          <Plus className="w-5 h-5 text-[#ff2a75]" />
          Add New Track
        </h2>

        <form onSubmit={handleAddSong} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Song Title"
              value={newSong.title}
              onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
              className="p-3 rounded-2xl bg-white border border-[#ffd0e0] text-sm font-bold"
            />
            <input
              type="text"
              placeholder="Artist"
              value={newSong.artist}
              onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
              className="p-3 rounded-2xl bg-white border border-[#ffd0e0] text-sm font-semibold"
            />
          </div>
          <input
            type="text"
            placeholder="Audio File Stream URL (.mp3)"
            value={newSong.audioUrl}
            onChange={(e) => setNewSong({ ...newSong, audioUrl: e.target.value })}
            className="w-full p-3 rounded-2xl bg-white border border-[#ffd0e0] text-sm font-mono"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Album Cover Image URL"
              value={newSong.coverUrl}
              onChange={(e) => setNewSong({ ...newSong, coverUrl: e.target.value })}
              className="p-3 rounded-2xl bg-white border border-[#ffd0e0] text-sm font-mono"
            />
            <input
              type="text"
              placeholder="Duration (e.g. 3:45)"
              value={newSong.duration}
              onChange={(e) => setNewSong({ ...newSong, duration: e.target.value })}
              className="p-3 rounded-2xl bg-white border border-[#ffd0e0] text-sm font-mono"
            />
          </div>
          <button type="submit" className="px-6 py-2.5 rounded-full bg-[#ff2a75] text-white font-bold text-xs shadow-md">
            Add Track to Boombox
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {songs.map((song) => (
          <div key={song._id} className="p-3 bg-white rounded-2xl border border-slate-200 shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={song.coverUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=150&q=80"} alt={song.title} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <div className="font-bold text-slate-900 text-sm">{song.title}</div>
                <div className="text-xs text-slate-500 font-semibold">{song.artist} ({song.duration})</div>
              </div>
            </div>
            <button onClick={() => handleDelete(song._id)} className="p-2 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

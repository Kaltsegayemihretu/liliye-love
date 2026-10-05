import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Disc, Play, Pause, Music, Radio, Volume2, Sparkles, X } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { api } from '../services/api';

export default function PinkBoombox({ songs = [] }) {
  const {
    boomboxActive,
    openBoombox,
    closeBoombox,
    currentSong,
    playlistPlaying,
    playSong,
    togglePlaylistPlay
  } = useAudio();

  const handleToggleBoombox = () => {
    if (boomboxActive) {
      closeBoombox();
      api.trackEvent('Boombox closed');
    } else {
      openBoombox();
      api.trackEvent('Boombox opened');
    }
  };

  const handleSelectSong = (song) => {
    playSong(song);
    api.trackEvent('Song selected', { songTitle: song.title, artist: song.artist });
  };

  const defaultSongs = [
    {
      _id: '1',
      title: 'I Wanna Be Yours',
      artist: 'Arctic Monkeys',
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-112708.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80',
      duration: '3:04'
    },
    {
      _id: '2',
      title: 'Golden Hour',
      artist: 'JVKE',
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a735e2.mp3?filename=romantic-guitars-10940.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80',
      duration: '3:29'
    },
    {
      _id: '3',
      title: 'Until I Found You',
      artist: 'Stephen Sanchez',
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939ab7b57.mp3?filename=romantic-acoustic-guitar-124443.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80',
      duration: '2:57'
    },
    {
      _id: '4',
      title: 'Lover',
      artist: 'Taylor Swift',
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_2911b3320f.mp3?filename=soft-piano-love-126487.mp3',
      coverUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=300&q=80',
      duration: '3:41'
    }
  ];

  const playlist = songs.length > 0 ? songs : defaultSongs;

  return (
    <div id="music" className="w-full max-w-4xl mx-auto my-20 px-4 flex flex-col items-center">
      
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#ffe4ec] text-[#ff2a75] text-xs font-extrabold uppercase tracking-wider mb-2">
          <Music className="w-3.5 h-3.5" />
          OUR SOUNDTRACK
        </span>
        <h2 className="font-display text-3xl md:text-5xl font-extrabold text-slate-900">
          Songs That Remind Me Of You 🎵
        </h2>
      </div>

      {/* Main Boombox Physical Device */}
      <div className="w-full max-w-2xl bg-gradient-to-br from-[#ff2a75] via-[#e60067] to-[#80003c] rounded-[3rem] p-6 md:p-10 shadow-2xl border-4 border-white/40 relative text-white overflow-hidden">
        
        {/* Top Handle Graphic */}
        <div className="w-36 h-6 mx-auto bg-white/20 rounded-t-2xl border-t-2 border-x-2 border-white/40 mb-6 flex items-center justify-center">
          <div className="w-20 h-1.5 bg-white/40 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Speaker Left */}
          <div className="hidden md:flex flex-col items-center justify-center">
            <div className="w-28 h-28 rounded-full bg-slate-950/40 border-4 border-white/20 p-2 flex items-center justify-center shadow-inner">
              <div className={`w-20 h-20 rounded-full border-4 border-[#ff2a75]/60 flex items-center justify-center ${playlistPlaying ? 'animate-pulse' : ''}`}>
                <Radio className="w-8 h-8 text-white/80" />
              </div>
            </div>
          </div>

          {/* Center Cassette Deck & Display */}
          <div className="flex flex-col items-center text-center space-y-4">
            
            {/* LED Status Screen */}
            <div className="w-full bg-slate-950/60 rounded-2xl p-4 border border-white/20 shadow-inner flex flex-col items-center">
              <div className="text-[10px] font-mono text-[#ffb6c1] uppercase tracking-widest flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${boomboxActive ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
                {boomboxActive ? (playlistPlaying ? 'PLAYING SOUNDTRACK' : 'BOOMBOX ACTIVE') : 'BOOMBOX STANDBY'}
              </div>

              <div className="font-mono text-sm md:text-base font-bold text-white mt-1 truncate max-w-[200px]">
                {currentSong ? `${currentSong.title} - ${currentSong.artist}` : 'Select A Memory Song'}
              </div>
            </div>

            {/* Main Interactive Open/Close Button */}
            <button
              onClick={handleToggleBoombox}
              className="w-full py-3.5 px-6 rounded-full bg-white text-[#ff2a75] hover:bg-[#ffe4ec] font-extrabold text-sm md:text-base shadow-xl transition-all flex items-center justify-center gap-2 group"
            >
              <Disc className={`w-5 h-5 text-[#ff2a75] ${boomboxActive ? 'animate-spin' : ''}`} />
              {boomboxActive ? 'Tap to close' : 'Tap to open'}
            </button>
          </div>

          {/* Speaker Right */}
          <div className="hidden md:flex flex-col items-center justify-center">
            <div className="w-28 h-28 rounded-full bg-slate-950/40 border-4 border-white/20 p-2 flex items-center justify-center shadow-inner">
              <div className={`w-20 h-20 rounded-full border-4 border-[#ff2a75]/60 flex items-center justify-center ${playlistPlaying ? 'animate-pulse' : ''}`}>
                <Volume2 className="w-8 h-8 text-white/80" />
              </div>
            </div>
          </div>

        </div>

        {/* SLIDE-OUT PLAYLIST PANEL */}
        <AnimatePresence>
          {boomboxActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-8 pt-6 border-t border-white/20 overflow-hidden"
            >
              <h4 className="font-display text-lg font-bold text-white mb-4 text-center">
                💖 Our Special Playlist
              </h4>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                {playlist.map((song) => {
                  const isSelected = currentSong?._id === song._id;
                  const isSongPlaying = isSelected && playlistPlaying;

                  return (
                    <div
                      key={song._id}
                      onClick={() => handleSelectSong(song)}
                      className={`p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isSelected 
                          ? 'bg-white text-slate-900 shadow-lg font-bold' 
                          : 'bg-white/10 hover:bg-white/20 text-white font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={song.coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=150&q=80'}
                          alt={song.title}
                          className="w-11 h-11 rounded-xl object-cover shadow-sm"
                        />
                        <div className="text-left">
                          <div className={`text-sm truncate ${isSelected ? 'text-[#ff2a75]' : 'text-white'}`}>
                            {song.title}
                          </div>
                          <div className={`text-xs ${isSelected ? 'text-slate-600' : 'text-white/70'}`}>
                            {song.artist}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono opacity-80">{song.duration}</span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? 'bg-[#ff2a75] text-white' : 'bg-white/20 text-white'}`}>
                          {isSongPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

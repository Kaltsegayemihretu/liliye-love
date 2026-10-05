import React from 'react';
import { Music, Play, Pause } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export default function AudioPlayerWidget() {
  const { bgPlaying, toggleBackgroundMusic, boomboxActive } = useAudio();

  if (boomboxActive) return null;

  return (
    <div className="fixed bottom-5 left-5 z-40">
      <div className="glass-card rounded-full pl-3 pr-4 py-2 flex items-center gap-3 shadow-xl border border-white/80 transition-all hover:scale-105">
        <button
          onClick={toggleBackgroundMusic}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            bgPlaying 
              ? 'bg-gradient-to-tr from-[#ff2a75] to-[#e60067] text-white shadow-md' 
              : 'bg-slate-100 text-slate-600 hover:bg-[#ffe4ec] hover:text-[#ff2a75]'
          }`}
        >
          {bgPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
        <div className="text-left pr-1">
          <div className="text-[11px] font-bold text-[#ff2a75] tracking-wide flex items-center gap-1">
            <Music className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
            {bgPlaying ? 'PLAYING BACKGROUND MUSIC' : 'BACKGROUND SOUNDTRACK'}
          </div>
          <div className="text-xs font-semibold text-slate-800">
            I Wanna Be Yours
          </div>
        </div>
      </div>
    </div>
  );
}

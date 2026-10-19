import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Heart, Calendar, Play, Pause, Sparkles } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export default function VideoMemory() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { pauseBackgroundMusic, resumeBackgroundMusic } = useAudio() || {};

  const handlePlay = () => {
    setIsPlaying(true);
    if (pauseBackgroundMusic) {
      pauseBackgroundMusic();
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (resumeBackgroundMusic) {
      resumeBackgroundMusic();
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (resumeBackgroundMusic) {
      resumeBackgroundMusic();
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  };

  return (
    <section id="video-memory" className="w-full max-w-3xl mx-auto my-20 px-4 flex flex-col items-center">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#ff2a75] text-xs font-bold shadow-md border border-[#ffd0e0] uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5 text-[#ff2a75]" />
          <span>July 4 Memory</span>
          <Sparkles className="w-3 h-3 text-[#ffa8bc]" />
        </div>

        <h2 className="font-display text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          A Video Kept For You 📽️
        </h2>
        <p className="text-sm md:text-base font-semibold text-slate-600 max-w-lg mx-auto">
          Recorded months ago when you were all that was on my mind.
        </p>
      </motion.div>

      {/* Main Video & Message Card */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="w-full bg-[#fffaf5] rounded-[2.5rem] p-5 sm:p-8 md:p-10 shadow-2xl border-2 border-[#ffd0e0] relative text-slate-800"
      >
        {/* Video Player Frame */}
        <div className="relative w-full max-w-xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border-4 border-white group">
          <video
            ref={videoRef}
            playsInline
            controls
            preload="metadata"
            poster="/video/july-4-poster.jpg"
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
            className="w-full aspect-square max-h-[520px] object-cover rounded-2xl mx-auto block"
          >
            <source src="/video/july-4-message.mp4" type="video/mp4" />
            <source src="https://i.imgur.com/KMfDPHn.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Romantic Letter Message Below The Video */}
        <div className="mt-10 pt-8 border-t border-[#ffd0e0] space-y-5 text-left max-w-2xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-extrabold text-[#ff2a75] uppercase tracking-wider">
            <Heart className="w-4 h-4 fill-[#ff2a75]" />
            <span>A Message With This Video</span>
          </div>

          <p className="text-base md:text-lg text-slate-700 leading-relaxed font-sans font-medium">
            It was recorded on July 4, months ago, Liliye. We were talking about you, and I started recording. I thought maybe I would show it to you one day, but I think that day is today.
          </p>

          <p className="text-base md:text-lg text-slate-700 leading-relaxed font-sans font-medium">
            Even my family misses you. Fa even gave us her blessing to get married at this point. I didn't want to meet your parents all this time because I thought I would leave unnecessary memories with them if we somehow broke up.
          </p>

          <p className="text-base md:text-lg text-slate-700 leading-relaxed font-sans font-medium">
            Gene, I put a curse on my family. I wish they hadn't met you because it wouldn't be fair to the other girls. I'm not sure if I could love them the way I loved you. I don't think I can ever love anyone the way I love you, or at least, I don't want to love another girl.
          </p>

          <p className="text-base md:text-lg text-slate-700 leading-relaxed font-sans font-medium">
            I want you to be the first and last girl my family ever meets. I want you to be my last. I will wait for you like Jacob waited for Rachel in the Bible. He waited fourteen years to marry her. I would rather wait for you to come back to me than try with other people, my love.
          </p>

          <p className="text-base md:text-lg text-slate-700 leading-relaxed font-sans font-medium">
            I will always keep my promise. If you see me with other girls, they're probably just friends. If you see me happy, know that it's temporary. You're my everything. The memories I have of you are better than dating someone else.
          </p>

          <p className="text-base md:text-lg text-slate-700 leading-relaxed font-sans font-medium">
            If you see me on the road and I don't say hey, it's because I'm respecting you and keeping my promise. I will LEAVE YOU ALONE, just like you asked me to. But know that I would do anything just to hug you. I would rather hug you once a year than hug other girls.
          </p>

          {/* Highlighted Closing Declaration */}
          <div className="pt-3">
            <div className="py-5 px-6 rounded-2xl bg-[#ffe4ec]/80 border-l-4 border-[#ff2a75] text-center shadow-sm">
              <p className="font-display text-xl md:text-2xl font-extrabold text-[#80003c] tracking-wide leading-relaxed">
                "I WILL WAIT FOR YOU. I DO LOVE YOU."
              </p>
            </div>
          </div>

          <div className="text-center pt-6">
            <p className="font-handwritten text-3xl text-[#ff2a75] font-bold">
              Forever Yours, Liliye ❤️
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

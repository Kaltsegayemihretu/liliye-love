import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const [bgPlaying, setBgPlaying] = useState(false);
  const [bgVolume, setBgVolume] = useState(0.35);
  const [boomboxActive, setBoomboxActive] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [playlistPlaying, setPlaylistPlaying] = useState(false);

  const bgAudioRef = useRef(null);
  const playlistAudioRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  const userManuallyPaused = useRef(false);

  // Background Audio initialization & Auto-play setup
  useEffect(() => {
    const audioUrl = '/audio/for-my-hand.mp3';
    bgAudioRef.current = new Audio(audioUrl);
    bgAudioRef.current.loop = true;
    bgAudioRef.current.volume = bgVolume;

    playlistAudioRef.current = new Audio();

    // Explicit ended handler to guarantee looping continuously
    const handleEnded = () => {
      if (bgAudioRef.current && !userManuallyPaused.current) {
        bgAudioRef.current.currentTime = 0;
        bgAudioRef.current.play()
          .then(() => setBgPlaying(true))
          .catch(() => {
            bgAudioRef.current.src = audioUrl;
            bgAudioRef.current.play().then(() => setBgPlaying(true)).catch(() => {});
          });
      }
    };

    bgAudioRef.current.addEventListener('ended', handleEnded);

    // Attempt instant autoplay when site opens
    const tryAutoplay = () => {
      if (userManuallyPaused.current) return;
      if (bgAudioRef.current && bgAudioRef.current.paused && !boomboxActive) {
        bgAudioRef.current.volume = bgVolume;
        bgAudioRef.current.loop = true;
        bgAudioRef.current.play()
          .then(() => {
            setBgPlaying(true);
            removeListeners();
          })
          .catch(() => {});
      }
    };

    const removeListeners = () => {
      window.removeEventListener('click', tryAutoplay);
      window.removeEventListener('touchstart', tryAutoplay);
      window.removeEventListener('keydown', tryAutoplay);
      window.removeEventListener('pointerdown', tryAutoplay);
    };

    // Try immediately on load
    tryAutoplay();

    // Attach interaction listeners so the song plays on the very first touch/click
    window.addEventListener('click', tryAutoplay);
    window.addEventListener('touchstart', tryAutoplay);
    window.addEventListener('keydown', tryAutoplay);
    window.addEventListener('pointerdown', tryAutoplay);

    return () => {
      removeListeners();
      if (bgAudioRef.current) {
        bgAudioRef.current.removeEventListener('ended', handleEnded);
        bgAudioRef.current.pause();
      }
      if (playlistAudioRef.current) playlistAudioRef.current.pause();
    };
  }, []);

  // Play background song after user interaction/name entry
  const startBackgroundMusic = () => {
    if (bgAudioRef.current && !boomboxActive) {
      userManuallyPaused.current = false;
      bgAudioRef.current.loop = true;
      bgAudioRef.current.volume = bgVolume;
      if (bgAudioRef.current.paused) {
        bgAudioRef.current.play()
          .then(() => setBgPlaying(true))
          .catch(() => {});
      } else {
        setBgPlaying(true);
      }
    }
  };

  const toggleBackgroundMusic = () => {
    if (!bgAudioRef.current) return;
    const isPlaying = !bgAudioRef.current.paused;
    if (isPlaying) {
      userManuallyPaused.current = true;
      bgAudioRef.current.pause();
      setBgPlaying(false);
    } else {
      userManuallyPaused.current = false;
      bgAudioRef.current.loop = true;
      bgAudioRef.current.volume = bgVolume;
      bgAudioRef.current.play()
        .then(() => setBgPlaying(true))
        .catch(() => {});
    }
  };

  // Fade out background song smoothly when Boombox opens
  const openBoombox = () => {
    setBoomboxActive(true);
    if (bgPlaying && bgAudioRef.current) {
      let vol = bgAudioRef.current.volume;
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      
      fadeIntervalRef.current = setInterval(() => {
        vol -= 0.05;
        if (vol <= 0) {
          vol = 0;
          clearInterval(fadeIntervalRef.current);
          bgAudioRef.current.pause();
          setBgPlaying(false);
        } else {
          bgAudioRef.current.volume = vol;
        }
      }, 100);
    }
  };

  const closeBoombox = () => {
    setBoomboxActive(false);
    if (playlistAudioRef.current) {
      playlistAudioRef.current.pause();
      setPlaylistPlaying(false);
    }
  };

  const playSong = (song) => {
    if (!song || !song.audioUrl) return;
    if (currentSong?._id === song._id && playlistPlaying) {
      playlistAudioRef.current.pause();
      setPlaylistPlaying(false);
    } else {
      setCurrentSong(song);
      playlistAudioRef.current.src = song.audioUrl;
      playlistAudioRef.current.volume = 0.5;
      playlistAudioRef.current.play()
        .then(() => setPlaylistPlaying(true))
        .catch(err => console.error('Failed to play song:', err));
    }
  };

  const togglePlaylistPlay = () => {
    if (!playlistAudioRef.current || !currentSong) return;
    if (playlistPlaying) {
      playlistAudioRef.current.pause();
      setPlaylistPlaying(false);
    } else {
      playlistAudioRef.current.play().then(() => setPlaylistPlaying(true)).catch(() => {});
    }
  };

  return (
    <AudioContext.Provider value={{
      bgPlaying,
      toggleBackgroundMusic,
      startBackgroundMusic,
      boomboxActive,
      openBoombox,
      closeBoombox,
      currentSong,
      playlistPlaying,
      playSong,
      togglePlaylistPlay
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);

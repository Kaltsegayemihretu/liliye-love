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

  // Background Audio initialization & Auto-play setup
  useEffect(() => {
    bgAudioRef.current = new Audio('https://docs.google.com/uc?export=download&id=1jZ5-GXKCUuS9PC4OLvVJDxzu87vn8EUb');
    bgAudioRef.current.loop = true;
    bgAudioRef.current.volume = bgVolume;

    playlistAudioRef.current = new Audio();

    // Attempt instant autoplay when site opens
    const tryAutoplay = () => {
      if (bgAudioRef.current && bgAudioRef.current.paused) {
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
    };

    // Try immediately on load
    tryAutoplay();

    // Attach interaction listeners so the song plays on the very first touch/click
    window.addEventListener('click', tryAutoplay);
    window.addEventListener('touchstart', tryAutoplay);
    window.addEventListener('keydown', tryAutoplay);

    return () => {
      removeListeners();
      if (bgAudioRef.current) bgAudioRef.current.pause();
      if (playlistAudioRef.current) playlistAudioRef.current.pause();
    };
  }, []);

  // Play background song after user interaction/name entry
  const startBackgroundMusic = () => {
    if (bgAudioRef.current && !boomboxActive) {
      bgAudioRef.current.loop = true;
      bgAudioRef.current.volume = bgVolume;
      bgAudioRef.current.play()
        .then(() => setBgPlaying(true))
        .catch(() => {});
    }
  };

  const toggleBackgroundMusic = () => {
    if (!bgAudioRef.current) return;
    if (bgPlaying) {
      bgAudioRef.current.pause();
      setBgPlaying(false);
    } else {
      bgAudioRef.current.volume = bgVolume;
      bgAudioRef.current.play().then(() => setBgPlaying(true)).catch(() => {});
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

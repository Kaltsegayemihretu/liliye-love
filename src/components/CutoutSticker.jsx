import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatImageUrl, getFallbackDriveUrl } from '../utils/image';

const GUARANTEED_FALLBACK = 'https://lh3.googleusercontent.com/d/1Ywnng1aKcnsroblkhBBhB6O4aW19j3n4';

export default function CutoutSticker({ imageUrl, caption, rotation = 0, className = '', onClick }) {
  const getInitialUrl = (url) => {
    if (url && url.includes('1Ed4PxbKSH2gTTmCU1XCE6ln3S_GtlP6x')) {
      return GUARANTEED_FALLBACK;
    }
    return formatImageUrl(url);
  };

  const [imgSrc, setImgSrc] = useState(() => getInitialUrl(imageUrl));

  useEffect(() => {
    setImgSrc(getInitialUrl(imageUrl));
  }, [imageUrl]);

  const handleImageError = () => {
    const fallback = getFallbackDriveUrl(imageUrl);
    if (imgSrc !== fallback && !imgSrc.includes('1Ywnng1aKcnsroblkhBBhB6O4aW19j3n4')) {
      setImgSrc(fallback);
    } else {
      setImgSrc(GUARANTEED_FALLBACK);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.08, rotate: 0, zIndex: 30 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      onClick={onClick}
      style={{ transform: `rotate(${rotation}deg)` }}
      className={`relative p-3 bg-white rounded-3xl shadow-xl border-2 border-[#ffd0e0]/80 cursor-pointer group select-none ${className}`}
    >
      {/* Decorative Tape Sticker */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rotate-2 z-10 pointer-events-none rounded-sm" />

      {/* Image Container */}
      <div className="overflow-hidden rounded-2xl bg-slate-100 aspect-square">
        <img
          src={imgSrc}
          alt={caption || 'Memory'}
          referrerPolicy="no-referrer"
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

    </motion.div>
  );
}

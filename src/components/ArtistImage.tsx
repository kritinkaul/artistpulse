'use client';

import { useState } from 'react';
import { User } from 'lucide-react';

interface ArtistImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ArtistImage({ src, alt, className = "" }: ArtistImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (imageError || !src || src.includes('placeholder')) {
    return (
      <div className={`bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl border border-gray-700/50 flex items-center justify-center ${className}`}>
        <User className="h-24 w-24 text-white/80" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl border border-gray-700/50 flex items-center justify-center animate-pulse">
          <User className="h-24 w-24 text-white/80" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full rounded-xl object-cover border border-gray-700/50 ${!imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={() => {
          console.log('Image failed to load:', src);
          setImageError(true);
        }}
        onLoad={() => {
          setImageLoaded(true);
        }}
      />
    </div>
  );
}

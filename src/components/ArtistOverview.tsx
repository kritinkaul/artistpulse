'use client';

import { useState, useEffect } from 'react';
import { User, Music, Calendar, Tag, Users, ExternalLink, Loader2, Award, MapPin } from 'lucide-react';
import ArtistImage from './ArtistImage';

interface ArtistProfile {
  id: string;
  name: string;
  image: string;
  bio: string;
  genres: string[];
  activeYears: string;
  label: string;
  followers: number;
  playcount?: number;
  birthPlace?: string;
  realName?: string;
  website?: string;
  lastfmStats?: {
    listeners: number;
    playcount: number;
  };
  spotifyPopularity?: number;
  spotifyUrl?: string;
  youtubeUrl?: string;
  socialLinks?: {
    spotify?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
}

interface ArtistOverviewProps {
  artistName: string;
}

export default function ArtistOverview({ artistName }: ArtistOverviewProps) {
  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (artistName) {
      fetchArtistProfile();
    }
  }, [artistName]);

  const fetchArtistProfile = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/artist-profile?artist=${encodeURIComponent(artistName)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch artist profile');
      }
      const data = await response.json();
      setProfile(data.profile);
    } catch (err) {
      setError('Failed to load artist profile');
      console.error('Error fetching artist profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
        <div className="flex items-center justify-center space-x-2 text-cyan-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm font-mono">LOADING ARTIST PROFILE...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-red-500/30 p-6">
        <div className="text-red-400 text-sm font-mono text-center">{error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
        <div className="text-center py-8">
          <User className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 font-mono">No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Enhanced background with multiple layers */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-75"></div>
      <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 hover:border-blue-500/50 p-8 transition-all duration-300 shadow-2xl">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Artist Overview</h3>
                <p className="text-sm text-gray-400 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                  PROFILE & BACKGROUND
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700/50">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="font-mono">VERIFIED</span>
            </div>
          </div>

          {/* Main Profile Section */}
          <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6 mb-6">
        {/* Profile Image & Basic Info */}
        <div className="flex-shrink-0">
          <div className="relative w-48 h-48 mx-auto lg:mx-0">
            <ArtistImage
              src={profile.image || ''}
              alt={profile.name}
              className="w-48 h-48"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-gray-800">
              <Award className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="flex-1">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{profile.name}</h2>
              {profile.realName && profile.realName !== profile.name && (
                <p className="text-gray-400 font-mono text-sm mb-2">Real Name: {profile.realName}</p>
              )}
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {profile.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs font-mono border border-blue-500/30"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Active: {profile.activeYears}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Music className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Label: {profile.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-300">
                    {profile.followers.toLocaleString()} followers
                  </span>
                </div>
                {profile.lastfmStats && (
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-red-400" />
                    <span className="text-sm text-gray-300">
                      {(profile.lastfmStats.playcount / 1000000).toFixed(1)}M plays on Last.fm
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {profile.birthPlace && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-300">From: {profile.birthPlace}</span>
                  </div>
                )}
                {profile.lastfmStats && (
                  <div className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-red-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM9.326 18.918c-2.726 0-4.94-2.087-4.94-4.66 0-2.573 2.214-4.66 4.94-4.66s4.94 2.087 4.94 4.66c0 2.573-2.214 4.66-4.94 4.66zm7.831-.924c-.617 0-1.117-.5-1.117-1.117s.5-1.117 1.117-1.117 1.117.5 1.117 1.117-.5 1.117-1.117 1.117z"/>
                    </svg>
                    <span className="text-sm text-gray-300">
                      {(profile.lastfmStats.listeners / 1000000).toFixed(1)}M listeners
                    </span>
                  </div>
                )}
                {profile.spotifyPopularity && (
                  <div className="flex items-center space-x-2">
                    <svg className="h-4 w-4 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                    <span className="text-sm text-gray-300">
                      {profile.spotifyPopularity}% popularity
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Platform Links */}
            <div className="flex flex-wrap gap-3 mt-4">
              {/* Spotify Button - Always show */}
              <a
                href={profile.spotifyUrl || profile.socialLinks?.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg transition-all duration-300 group"
              >
                <svg 
                  className="h-5 w-5 text-green-400 group-hover:text-green-300" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                <span className="text-sm font-medium text-green-400 group-hover:text-green-300">
                  Open on Spotify
                </span>
              </a>

              {/* YouTube Button - Always show */}
              <a
                href={profile.youtubeUrl || profile.socialLinks?.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-all duration-300 group"
              >
                <svg 
                  className="h-5 w-5 text-red-400 group-hover:text-red-300" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span className="text-sm font-medium text-red-400 group-hover:text-red-300">
                  Watch on YouTube
                </span>
              </a>

              {/* Official Website if available */}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg transition-all duration-300 group"
                >
                  <ExternalLink className="h-4 w-4 text-blue-400 group-hover:text-blue-300" />
                  <span className="text-sm font-medium text-blue-400 group-hover:text-blue-300">
                    Official Website
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
            <Tag className="h-4 w-4 mr-2" />
            Biography
          </h4>
          <p className="text-gray-300 text-sm leading-relaxed">{profile.bio}</p>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}

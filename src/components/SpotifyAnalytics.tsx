'use client';

import { useState, useEffect } from 'react';
import { Play, Users, TrendingUp, Music, ExternalLink, Disc3, Heart, Clock } from 'lucide-react';
import { SpotifyTrack } from '@/lib/api-services';

interface SpotifyAnalyticsProps {
  artistId: string;
  artistName: string;
  spotifyData?: any;
}

export default function SpotifyAnalytics({ artistId, artistName, spotifyData }: SpotifyAnalyticsProps) {
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (spotifyData) {
      setStats({
        artist: spotifyData.artist,
        albums: spotifyData.albums
      });
      setTopTracks(spotifyData.topTracks || []);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [spotifyData]);

  if (isLoading) {
    return (
      <div className="bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 cyber-glow">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-700 rounded-xl"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      const billions = num / 1000000000;
      return billions % 1 === 0 ? billions.toFixed(0) + 'B' : billions.toFixed(1) + 'B';
    } else if (num >= 1000000) {
      const millions = num / 1000000;
      return millions % 1 === 0 ? millions.toFixed(0) + 'M' : millions.toFixed(1) + 'M';
    } else if (num >= 1000) {
      const thousands = num / 1000;
      return thousands % 1 === 0 ? thousands.toFixed(0) + 'K' : thousands.toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 cyber-glow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg cyber-glow">
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.959-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.361 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Spotify Analytics</h2>
            <p className="text-sm text-gray-400">Streaming data & performance metrics</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700/50">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-mono">LIVE DATA</span>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-800/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center cyber-glow">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-purple-400 font-mono">FOLLOWERS</span>
              </div>
              <p className="text-2xl font-bold text-white font-mono">
                {stats.artist?.followers?.total ? formatNumber(stats.artist.followers.total) : 'N/A'}
              </p>
              <p className="text-xs text-gray-400 mt-1">Monthly listeners</p>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-green-800/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-green-500/30 hover:border-green-400/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center cyber-glow">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-green-400 font-mono">POPULARITY</span>
              </div>
              <p className="text-2xl font-bold text-white font-mono">
                {stats.artist?.popularity || 'N/A'}
              </p>
              <p className="text-xs text-gray-400 mt-1">Out of 100</p>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-800/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center cyber-glow">
                  <Disc3 className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-blue-400 font-mono">ALBUMS</span>
              </div>
              <p className="text-2xl font-bold text-white font-mono">
                {stats.albums?.length || 'N/A'}
              </p>
              <p className="text-xs text-gray-400 mt-1">Total releases</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white font-mono">
            <span className="text-cyan-400">&gt;</span> TOP TRACKS
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Heart className="h-4 w-4 text-red-400" />
            <span className="font-mono">MOST POPULAR</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {topTracks && topTracks.length > 0 ? (
            topTracks.slice(0, 5).map((track, index) => (
              <div key={track.id} className="group bg-gray-800/30 backdrop-blur-sm hover:bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-200 scan-line">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {track.album.images && track.album.images.length > 0 ? (
                        <img
                          src={track.album.images[0].url}
                          alt={track.album.name}
                          className="w-12 h-12 rounded-lg object-cover shadow-md border border-gray-600/50"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md cyber-glow">
                          <Music className="h-6 w-6 text-white" />
                        </div>
                      )}
                      {index < 3 && (
                        <div className="absolute -top-1 -left-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                          <span className="text-xs">🔥</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                        {track.name}
                      </p>
                      <p className="text-sm text-gray-400">{track.album.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-300">
                        <TrendingUp className="h-3 w-3 text-green-400" />
                        <span className="font-medium font-mono">{track.popularity}</span>
                      </div>
                      <p className="text-xs text-gray-500">Popularity</p>
                    </div>
                    <a
                      href={track.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-3 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg transition-all duration-300 group"
                    >
                      <svg 
                        className="h-4 w-4 text-green-400 group-hover:text-green-300" 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                      >
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                      </svg>
                      <span className="text-xs font-medium text-green-400 group-hover:text-green-300">
                        Play
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-700/50">
                <Music className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-400 font-medium">No top tracks available</p>
              <p className="text-sm text-gray-500 mt-1">Try searching for a different artist</p>
            </div>
          )}
        </div>
      </div>

      {/* Albums Section */}
      {stats && stats.albums && stats.albums.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white font-mono">
              <span className="text-cyan-400">&gt;</span> LATEST ALBUMS
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Disc3 className="h-4 w-4 text-blue-400" />
              <span className="font-mono">RECENT RELEASES</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {stats.albums.slice(0, 8).map((album: any, index: number) => (
              <div key={album.id} className="group bg-gray-800/30 backdrop-blur-sm hover:bg-gray-800/50 rounded-xl p-3 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-200 scan-line">
                <div className="flex flex-col">
                  <div className="relative mb-3">
                    {album.images && album.images.length > 0 ? (
                      <img
                        src={album.images[0].url}
                        alt={album.name}
                        className="w-full aspect-square rounded-lg object-cover shadow-md group-hover:shadow-lg transition-shadow duration-200 border border-gray-600/50"
                      />
                    ) : (
                      <div className="w-full aspect-square bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md cyber-glow">
                        <Disc3 className="h-8 w-8 text-white" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 border border-gray-600/50">
                      <span className="text-xs text-cyan-400 font-medium font-mono">{album.total_tracks}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-white group-hover:text-cyan-400 transition-colors mb-1 text-sm overflow-hidden">
                      <span className="block truncate">{album.name}</span>
                    </h4>
                    <p className="text-xs text-gray-400 mb-2 capitalize font-mono">{album.album_type || 'Album'}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500 font-mono">
                        {new Date(album.release_date).getFullYear()}
                      </div>
                      <a
                        href={album.external_urls?.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg cyber-glow"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 
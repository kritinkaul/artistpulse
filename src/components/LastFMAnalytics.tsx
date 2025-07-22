'use client';

import { Activity, TrendingUp, Zap } from 'lucide-react';

interface LastFMAnalyticsProps {
  lastfmData?: {
    artist?: {
      stats?: {
        listeners: string;
        playcount: string;
      };
      tags?: {
        tag: Array<{
          name: string;
          url: string;
        }>;
      };
    };
  };
}

export default function LastFMAnalytics({ lastfmData }: LastFMAnalyticsProps) {
  if (!lastfmData?.artist?.stats) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-gray-700/50">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Last.fm Analytics</h3>
            <p className="text-sm text-gray-400 font-mono flex items-center gap-2">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
              LISTENING BEHAVIOR
            </p>
          </div>
        </div>

        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Activity className="w-12 h-12 mx-auto opacity-50" />
          </div>
          <p className="text-gray-500">No Last.fm listening data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-gray-700/50">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-red-600/10 to-red-700/10 rounded-xl blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Last.fm Analytics</h3>
              <p className="text-sm text-gray-400 font-mono flex items-center gap-2">
                <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                LISTENING BEHAVIOR
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-800/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-red-500/20 hover:border-red-500/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="h-5 w-5 text-red-400" />
                  <span className="text-sm text-red-400 font-mono">TOTAL LISTENERS</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  {parseInt(lastfmData.artist.stats?.listeners || '0').toLocaleString()}
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-cyan-800/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="h-5 w-5 text-cyan-400" />
                  <span className="text-sm text-cyan-400 font-mono">TOTAL PLAYS</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  {parseInt(lastfmData.artist.stats?.playcount || '0').toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {lastfmData.artist.tags?.tag && lastfmData.artist.tags.tag.length > 0 && (
            <div className="mt-8">
              <h4 className="text-sm font-semibold text-gray-300 mb-4 font-mono">GENRE TAGS</h4>
              <div className="flex flex-wrap gap-3">
                {lastfmData.artist.tags.tag.slice(0, 6).map((tag: any, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-red-500/20 text-red-300 rounded-lg text-xs font-medium border border-red-500/30 hover:border-red-500/50 transition-colors font-mono"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

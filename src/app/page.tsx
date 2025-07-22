'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Play, 
  Heart, 
  Calendar,
  Music,
  BarChart3,
  Globe,
  Search,
  Target,
  Award,
  Database,
  User,
  Activity,
  MessageSquare,
  Newspaper
} from 'lucide-react';
import ArtistSearch from '@/components/ArtistSearch';
import SpotifyAnalytics from '@/components/SpotifyAnalytics';
import EventCalendar from '@/components/EventCalendar';
import YouTubeAnalytics from '@/components/YouTubeAnalytics';
import TwitterAnalytics from '@/components/TwitterAnalytics';
import RedditAnalytics from '@/components/RedditAnalytics';
import Demographics from '@/components/Demographics';
import NewsFeed from '@/components/NewsFeed';
import ArtistOverview from '@/components/ArtistOverview';
import TopCities from '@/components/TopCities';
import CareerTimeline from '@/components/CareerTimeline';
import GoogleTrends from '@/components/GoogleTrends';
import LastFMAnalytics from '@/components/LastFMAnalytics';

export default function Home() {
  // Track client mount to avoid hydration mismatches
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const [artistData, setArtistData] = useState<any>(null);
  const [currentArtist, setCurrentArtist] = useState<string>('');

  const handleArtistFound = (data: any) => {
    setArtistData(data);
    setCurrentArtist(data.spotify?.artist?.name || 'Unknown Artist');
  };

  const metrics = [
    {
      title: 'Stream Analytics',
      value: 'ACTIVE',
      status: 'Processing 2.4M+ data points',
      icon: Play,
      color: 'cyan'
    },
    {
      title: 'Social Monitoring',
      value: 'LIVE',
      status: '847K+ interactions tracked',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Engagement Engine',
      value: '94.2%',
      status: 'Cross-platform correlation',
      icon: Heart,
      color: 'blue'
    },
    {
      title: 'Revenue Tracking',
      value: 'ENABLED',
      status: '15.3% growth detected',
      icon: TrendingUp,
      color: 'green'
    }
  ];

  const features = [
    {
      icon: Music,
      title: 'Spotify Deep Analytics',
      description: 'Real-time streaming metrics, track performance, and audience insights',
      features: ['Stream velocity', 'Playlist penetration', 'Skip rate analysis'],
      color: 'green'
    },
    {
      icon: Play,
      title: 'YouTube Intelligence',
      description: 'Video performance, engagement patterns, and viral coefficient tracking',
      features: ['View acceleration', 'Comment sentiment', 'Share velocity'],
      color: 'red'
    },
    {
      icon: Calendar,
      title: 'Event Radar',
      description: 'Concert analytics, venue capacity optimization, and tour predictions',
      features: ['Demand forecasting', 'Market penetration', 'Revenue modeling'],
      color: 'blue'
    },
    {
      icon: Globe,
      title: 'Social Pulse',
      description: 'Cross-platform sentiment analysis and engagement correlation',
      features: ['Trend detection', 'Influence mapping', 'Viral tracking'],
      color: 'purple'
    },
    {
      icon: Target,
      title: 'Geographic Intelligence',
      description: 'Location-based performance metrics and market penetration analysis',
      features: ['Market ranking', 'Regional trends', 'Expansion opportunities'],
      color: 'cyan'
    },
    {
      icon: Award,
      title: 'Competitive Analysis',
      description: 'Peer comparison and industry benchmarking with ML predictions',
      features: ['Market position', 'Growth trajectory', 'Opportunity scoring'],
      color: 'orange'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 grid-background opacity-30"></div>
      {/* Floating Data Particles (client-only to avoid hydration mismatches) */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="relative group">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center cyber-glow">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-white">ArtistPulse</h1>
                <p className="text-xs text-cyan-400 font-mono">v2.0 • HIGH-FREQUENCY DATA</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm font-medium text-gray-300">
                <span className="text-cyan-400 font-mono">Made by</span>
                <span className="ml-2 text-white font-semibold">Kritin</span>
              </div>
              
              <div className="flex items-center text-xs font-mono text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                LIVE
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Interface */}
        <div className="mb-8">
          <ArtistSearch onArtistFound={handleArtistFound} />
        </div>

        {!artistData ? (
          // Data Analysis Dashboard
          <>
            {/* Command Center Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-900 rounded-2xl border border-cyan-500/30 cyber-glow mb-6 scan-line">
                <Database className="h-12 w-12 text-cyan-400" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                ARTIST INTELLIGENCE
                <span className="block text-lg font-mono text-cyan-400 mt-2">PLATFORM</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Advanced multi-platform analytics engine providing real-time insights across 
                <span className="text-cyan-400 font-semibold"> Spotify</span>, 
                <span className="text-purple-400 font-semibold"> YouTube</span>, 
                <span className="text-blue-400 font-semibold"> Twitter</span>, 
                <span className="text-orange-400 font-semibold"> Reddit</span>, and 
                <span className="text-red-400 font-semibold"> Last.fm</span>
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {metrics.map((metric, index) => (
                <div
                  key={index}
                  className="bg-gray-900/70 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6 hover:border-cyan-500/50 transition-all duration-300 cyber-glow data-pulse"
                >
                  <div className="flex items-center justify-between mb-4">
                    <metric.icon className="h-8 w-8 text-cyan-400" />
                    <span className="text-xs font-mono text-gray-500">#{index + 1}</span>
                  </div>
                  <h3 className="text-sm font-mono text-gray-400 mb-1">{metric.title}</h3>
                  <p className="text-2xl font-bold text-cyan-400 mb-2 font-mono">{metric.value}</p>
                  <p className="text-xs text-gray-500">{metric.status}</p>
                </div>
              ))}
            </div>

            {/* Features Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6 hover:border-cyan-500/30 transition-all duration-300 group scan-line"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                      <p className="text-xs font-mono text-gray-500">MODULE_{index + 1}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4 text-sm leading-relaxed">{feature.description}</p>
                  <div className="space-y-1">
                    {feature.features.map((item, idx) => (
                      <div key={idx} className="flex items-center text-xs text-gray-400">
                        <div className="w-1 h-1 bg-cyan-400 rounded-full mr-2" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <div className="bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-8 cyber-glow">
                <Search className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">INITIATE ANALYSIS</h2>
                <p className="text-gray-400 font-mono">Search for an artist to begin deep intelligence gathering</p>
              </div>
            </div>
          </>
        ) : (
          // Artist Analysis Results
          <div className="space-y-8">
            {/* Artist Header */}
            <div className="bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-8 cyber-glow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {artistData.spotify?.artist?.images?.[0]?.url ? (
                    <img
                      src={artistData.spotify.artist.images[0].url}
                      alt={currentArtist}
                      className="w-20 h-20 rounded-xl object-cover border-2 border-cyan-500/30"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <User className="h-10 w-10 text-white" />
                    </div>
                  )}
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{currentArtist}</h1>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-mono text-cyan-400">
                        ID: {artistData.spotify?.artist?.id?.slice(0, 8) || 'N/A'}
                      </span>
                      <div className="flex items-center text-gray-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                        DATA STREAMING
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-cyan-400 font-mono">
                    #{artistData.spotify?.artist?.popularity || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-400">POPULARITY INDEX</div>
                </div>
              </div>
            </div>

            {/* Artist Profile */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 font-mono">
                <span className="text-cyan-400">&gt;</span> ARTIST PROFILE
              </h2>
              <ArtistOverview artistName={currentArtist} />
            </section>

            {/* Platform Analytics */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 font-mono">
                <span className="text-cyan-400">&gt;</span> PLATFORM ANALYTICS
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Spotify Analytics */}
                {artistData.spotify && (
                  <SpotifyAnalytics 
                    artistId={artistData.spotify.artist?.id || ''} 
                    artistName={currentArtist}
                    spotifyData={{
                      artist: artistData.spotify.artist,
                      albums: artistData.spotify.albums,
                      topTracks: artistData.spotify.topTracks
                    }}
                  />
                )}

                {/* YouTube Analytics */}
                <YouTubeAnalytics artistName={currentArtist} />

                {/* Last.fm Analytics */}
                <LastFMAnalytics lastfmData={artistData.lastfm} />

                {/* Twitter Analytics */}
                <TwitterAnalytics artistName={currentArtist} />

                {/* Reddit Analytics */}
                <RedditAnalytics artistName={currentArtist} />
              </div>
            </section>

            {/* News & Events Section */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 font-mono">
                <span className="text-cyan-400">&gt;</span> NEWS & EVENTS
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* News Feed */}
                <NewsFeed artistName={currentArtist} />
                
                {/* Event Calendar */}
                <EventCalendar artistName={currentArtist} />
              </div>
            </section>

            {/* Career Timeline */}
            <section>
              <CareerTimeline artistName={currentArtist} />
            </section>

            {/* Geographic Analysis */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 font-mono">
                <span className="text-cyan-400">&gt;</span> GEOGRAPHIC ANALYSIS
              </h2>
              <div className="space-y-8">
                {/* Google Trends Analytics */}
                <GoogleTrends googleTrends={artistData.googleTrends} />
                
                <div className="relative">
                  <div className="absolute top-0 right-0 bg-yellow-500/20 border border-yellow-500/50 rounded-lg px-3 py-1 text-xs font-mono text-yellow-400 z-10">
                    ⚠ ESTIMATED DATA
                  </div>
                  <TopCities artistName={currentArtist} />
                </div>
                
                <div className="relative">
                  <div className="absolute top-0 right-0 bg-yellow-500/20 border border-yellow-500/50 rounded-lg px-3 py-1 text-xs font-mono text-yellow-400 z-10">
                    ⚠ ESTIMATED DATA
                  </div>
                  <Demographics artistName={currentArtist} lastfmData={artistData.lastfm} />
                </div>
              </div>
            </section>

          </div>
        )}
      </main>
    </div>
  );
}

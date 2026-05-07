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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Enhanced Animated Background Grid with Musical Pulse */}
      <div className="absolute inset-0 grid-background opacity-50"></div>
      
      {/* Enhanced Floating Musical Particles (client-only to avoid hydration mismatches) */}
      {mounted && (
        <>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => {
              const colors = ['#00d9ff', '#b537f2', '#ff00a8', '#00ff88'];
              const color = colors[i % colors.length];
              return (
                <div
                  key={i}
                  className="absolute rounded-full animate-float"
                  style={{
                    width: `${Math.random() * 4 + 2}px`,
                    height: `${Math.random() * 4 + 2}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: color,
                    boxShadow: `0 0 ${Math.random() * 20 + 10}px ${color}`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${3 + Math.random() * 4}s`,
                    opacity: 0.6
                  }}
                />
              );
            })}
          </div>
          
          {/* Musical Waveform Bars */}
          <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-center gap-1 opacity-20 pointer-events-none">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-neon-cyan via-neon-purple to-neon-pink rounded-t-full equalizer-bar"
                style={{
                  animationDelay: `${i * 0.05}s`,
                  animationDuration: `${1 + Math.random() * 0.5}s`
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Premium Header with Musical Theme */}
      <header className="relative z-10 border-b border-neon-cyan/20 glass-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="relative group">
                {/* Animated Glow Effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink rounded-2xl opacity-75 blur-lg group-hover:opacity-100 transition duration-500 animate-pulse-glow"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-2xl flex items-center justify-center cyber-glow shadow-neon-cyan animate-pulse-glow">
                  <BarChart3 className="h-8 w-8 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-neon-green to-emerald-400 rounded-full animate-pulse shadow-neon-green" />
              </div>
              <div className="ml-2">
                <h1 className="text-2xl font-bold text-white tracking-tight gradient-text" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  ArtistPulse
                </h1>
                <p className="text-xs text-neon-cyan font-mono tracking-wider animate-pulse">
                  v2.0 • LIVE MUSIC ANALYTICS
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-sm font-medium">
                <span className="text-neon-cyan font-mono tracking-wide">Created by</span>
                <span className="ml-2 text-white font-bold text-glow">Kritin</span>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-neon-green/10 border border-neon-green/30">
                <div className="w-2.5 h-2.5 bg-neon-green rounded-full animate-pulse shadow-neon-green" />
                <span className="text-xs font-mono text-neon-green font-semibold tracking-wider">LIVE</span>
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
            {/* Command Center Header with Musical Theme */}
            <div className="text-center mb-16">
              <div className="relative inline-flex items-center justify-center mb-8">
                {/* Animated Glow Rings */}
                <div className="absolute w-32 h-32 rounded-full bg-neon-cyan/20 blur-2xl animate-pulse-glow"></div>
                <div className="absolute w-24 h-24 rounded-full bg-neon-purple/20 blur-xl animate-pulse-glow" style={{ animationDelay: '0.5s' }}></div>
                
                {/* Main Icon Container */}
                <div className="relative w-28 h-28 glass-musical rounded-3xl border-2 border-neon-cyan/40 cyber-glow sound-ripple flex items-center justify-center">
                  <Database className="h-14 w-14 text-neon-cyan drop-shadow-lg" />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-neon-pink to-neon-purple rounded-full flex items-center justify-center animate-bounce-slow shadow-neon-pink">
                    <Music className="h-4 w-4 text-white" aria-label="Music icon" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-5xl font-bold text-white mb-4 tracking-tight" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                <span className="text-gradient-animate">ARTIST INTELLIGENCE</span>
                <span className="block text-xl font-mono text-neon-cyan mt-3 tracking-widest animate-pulse">
                  🎵 MUSIC ANALYTICS PLATFORM 🎵
                </span>
              </h1>
              
              <p className="text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                Advanced multi-platform analytics engine providing real-time insights across{' '}
                <span className="text-neon-green font-bold text-glow">Spotify</span>,{' '}
                <span className="text-neon-purple font-bold text-glow-purple">YouTube</span>,{' '}
                <span className="text-neon-cyan font-bold text-glow">Twitter</span>,{' '}
                <span className="text-neon-pink font-bold text-glow-pink">Reddit</span>, and{' '}
                <span className="text-red-400 font-bold">Last.fm</span>
              </p>
            </div>

            {/* Enhanced Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {metrics.map((metric, index) => {
                const glowColors = ['neon-cyan', 'neon-purple', 'neon-blue', 'neon-green'];
                const glowColor = glowColors[index % glowColors.length];
                return (
                  <div
                    key={index}
                    className="group relative glass-strong rounded-2xl border-2 border-neon-cyan/20 p-6 hover:border-neon-cyan/60 transition-all duration-500 hover-lift overflow-hidden"
                  >
                    {/* Animated Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-${glowColor}/10 shadow-${glowColor} group-hover:scale-110 transition-transform duration-300`}>
                          <metric.icon className={`h-7 w-7 text-${glowColor}`} />
                        </div>
                        <span className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">#{index + 1}</span>
                      </div>
                      <h3 className="text-sm font-mono text-gray-300 mb-2 uppercase tracking-wider">{metric.title}</h3>
                      <p className={`text-3xl font-bold text-${glowColor} mb-2 font-mono tracking-tight`}>{metric.value}</p>
                      <p className="text-xs text-gray-400 leading-relaxed">{metric.status}</p>
                    </div>
                    
                    {/* Corner Accent */}
                    <div className={`absolute top-0 right-0 w-20 h-20 bg-${glowColor}/10 rounded-bl-full blur-xl opacity-50`}></div>
                  </div>
                );
              })}
            </div>

            {/* Enhanced Features Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative glass-musical rounded-2xl border-2 border-neon-purple/20 p-8 hover:border-neon-purple/60 transition-all duration-500 hover-lift overflow-hidden"
                >
                  {/* Animated Scan Line Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer-musical"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-5 mb-6">
                      <div className="relative">
                        {/* Icon Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative w-16 h-16 bg-gradient-to-br from-neon-cyan via-neon-purple to-neon-pink rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-neon-cyan">
                          <feature.icon className="h-8 w-8 text-white drop-shadow-lg" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-neon-cyan transition-colors duration-300">{feature.title}</h3>
                        <p className="text-xs font-mono text-neon-purple uppercase tracking-widest">MODULE • {index + 1}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-200 mb-6 text-sm leading-relaxed">{feature.description}</p>
                    
                    <div className="space-y-3">
                      {feature.features.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 group/item">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-neon-cyan/20 flex items-center justify-center mt-0.5 group-hover/item:bg-neon-cyan/40 transition-colors duration-300">
                            <div className="w-2 h-2 bg-neon-cyan rounded-full shadow-neon-cyan" />
                          </div>
                          <span className="text-sm text-gray-300 group-hover/item:text-white transition-colors duration-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Call to Action */}
            <div className="text-center">
              <div className="relative group">
                {/* Glowing Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 via-neon-purple/20 to-neon-pink/20 rounded-3xl blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-glow"></div>
                
                {/* Main Container */}
                <div className="relative glass-strong rounded-3xl border-2 border-neon-cyan/40 p-12 hover:border-neon-cyan/80 transition-all duration-500 overflow-hidden">
                  {/* Animated Background Scan */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-purple/10 to-transparent animate-shimmer-musical"></div>
                  
                  <div className="relative z-10">
                    {/* Icon with Musical Animation */}
                    <div className="relative inline-block mb-6">
                      <div className="absolute inset-0 bg-neon-cyan/30 rounded-full blur-2xl animate-pulse-glow"></div>
                      <div className="relative w-24 h-24 bg-gradient-to-br from-neon-cyan via-neon-purple to-neon-pink rounded-full flex items-center justify-center shadow-neon-cyan group-hover:scale-110 transition-transform duration-500">
                        <Search className="h-12 w-12 text-white drop-shadow-lg" />
                      </div>
                      {/* Musical Note Accents */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-neon-green rounded-full flex items-center justify-center animate-bounce-slow shadow-neon-green">
                        <Music className="h-4 w-4 text-white" aria-label="Music note decoration" />
                      </div>
                    </div>
                    
                    <h2 className="text-4xl font-bold text-white mb-3 tracking-tight" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                      <span className="text-gradient-animate">INITIATE ANALYSIS</span>
                    </h2>
                    <p className="text-lg text-gray-300 font-mono mb-6 tracking-wide">
                      🎵 Search for an artist to begin deep intelligence gathering 🎵
                    </p>
                    
                    {/* Feature Pills */}
                    <div className="flex flex-wrap justify-center gap-3">
                      {['Real-time Data', 'Multi-platform', 'AI-Powered', 'Live Updates'].map((tag, i) => (
                        <span key={i} className="px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-sm font-mono hover:bg-neon-cyan/20 transition-colors duration-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Artist Analysis Results
          <div className="space-y-10">
            {/* Enhanced Artist Header */}
            <div className="relative group">
              {/* Glowing Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 via-neon-purple/20 to-neon-pink/20 rounded-3xl blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative glass-strong rounded-3xl border-2 border-neon-cyan/40 p-10 hover:border-neon-cyan/80 transition-all duration-500 overflow-hidden">
                {/* Animated Scan Line */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan/10 to-transparent animate-shimmer-musical"></div>
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <div className="relative">
                      {/* Artist Image with Glow */}
                      {artistData.spotify?.artist?.images?.[0]?.url ? (
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-2xl blur-xl opacity-60"></div>
                          <img
                            src={artistData.spotify.artist.images[0].url}
                            alt={currentArtist}
                            className="relative w-28 h-28 rounded-2xl object-cover border-4 border-neon-cyan/40 shadow-neon-cyan"
                          />
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-2xl blur-xl opacity-60"></div>
                          <div className="relative w-28 h-28 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-2xl flex items-center justify-center shadow-neon-cyan">
                            <User className="h-14 w-14 text-white" />
                          </div>
                        </div>
                      )}
                      {/* Live Indicator */}
                      <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-neon-green/20 border border-neon-green/50 flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse shadow-neon-green" />
                        <span className="text-xs font-mono text-neon-green font-semibold">LIVE</span>
                      </div>
                    </div>
                    
                    <div>
                      <h1 className="text-4xl font-bold text-white mb-3 tracking-tight" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                        <span className="text-gradient-animate">{currentArtist}</span>
                      </h1>
                      <div className="flex items-center gap-5 text-sm">
                        <span className="font-mono text-neon-cyan bg-neon-cyan/10 px-3 py-1 rounded-lg border border-neon-cyan/30">
                          ID: {artistData.spotify?.artist?.id?.slice(0, 8) || 'N/A'}
                        </span>
                      <div className="flex items-center text-gray-300 bg-neon-purple/10 px-3 py-1 rounded-lg border border-neon-purple/30">
                        <Activity className="h-4 w-4 text-neon-purple mr-2" />
                        <span className="font-mono text-neon-purple font-semibold">DATA STREAMING</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-neon-pink/30 rounded-2xl blur-xl"></div>
                    <div className="relative bg-neon-pink/10 border-2 border-neon-pink/40 rounded-2xl px-6 py-4">
                      <div className="text-4xl font-bold text-neon-pink font-mono tracking-tight">
                        #{artistData.spotify?.artist?.popularity || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-300 font-mono uppercase tracking-wider mt-1">Popularity</div>
                    </div>
                  </div>
                </div>
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

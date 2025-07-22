'use client';

import { useState, useEffect } from 'react';
import { Calendar, Award, TrendingUp, ExternalLink, Loader2, Music, Trophy, Star } from 'lucide-react';

interface TimelineEvent {
  id: string;
  date: string;
  type: 'release' | 'award' | 'viral' | 'tour' | 'press';
  title: string;
  description: string;
  link?: string;
  impact?: number;
  category?: string;
}

interface CareerTimelineProps {
  artistName: string;
}

export default function CareerTimeline({ artistName }: CareerTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'releases' | 'awards' | 'viral'>('all');

  useEffect(() => {
    if (artistName) {
      fetchTimelineData();
    }
  }, [artistName]);

  const fetchTimelineData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/timeline?artist=${encodeURIComponent(artistName)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch timeline data');
      }
      const data = await response.json();
      
      // Only show timeline if we have meaningful real data
      const realEvents = (data.events || []).filter((event: any) => 
        event.link && event.link.startsWith('http') && !event.link.includes('example.com')
      );
      
      // If we don't have enough real data, don't show anything
      if (realEvents.length < 2) {
        setEvents([]);
      } else {
        setEvents(data.events || []);
      }
    } catch (err) {
      setError('Failed to load timeline data');
      console.error('Error fetching timeline:', err);
      setEvents([]); // Don't show component on error
    } finally {
      setIsLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'release':
        return Music;
      case 'award':
        return Trophy;
      case 'viral':
        return TrendingUp;
      case 'tour':
        return Calendar;
      case 'press':
        return Star;
      default:
        return Calendar;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'release':
        return 'from-blue-500 to-cyan-500';
      case 'award':
        return 'from-yellow-500 to-orange-500';
      case 'viral':
        return 'from-pink-500 to-purple-500';
      case 'tour':
        return 'from-green-500 to-emerald-500';
      case 'press':
        return 'from-indigo-500 to-blue-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const filteredEvents = events.filter(event => {
    if (activeTab === 'all') return true;
    if (activeTab === 'releases') return event.type === 'release';
    if (activeTab === 'awards') return event.type === 'award';
    if (activeTab === 'viral') return event.type === 'viral';
    return true;
  });

  const tabs = [
    { id: 'all', label: 'All Events', count: events.length },
    { id: 'releases', label: 'Releases', count: events.filter(e => e.type === 'release').length },
    { id: 'awards', label: 'Awards', count: events.filter(e => e.type === 'award').length },
    { id: 'viral', label: 'Viral', count: events.filter(e => e.type === 'viral').length },
  ];

  if (isLoading) {
    return (
      <div className="relative group">
        {/* Enhanced background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-75"></div>
        <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 transition-all duration-300 shadow-2xl">
          <div className="flex items-center justify-center space-x-2 text-cyan-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm font-mono">ANALYZING CAREER DATA...</span>
          </div>
        </div>
      </div>
    );
  }

  // Don't render component if no meaningful data
  if (!isLoading && events.length === 0) {
    return null;
  }

  if (error) {
    return null; // Don't show error, just hide component
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-6 font-mono">
          <span className="text-cyan-400">&gt;</span> CAREER TIMELINE
        </h2>
      </div>
      
      <div className="relative group">
        {/* Enhanced background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-75"></div>
        <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 hover:border-purple-500/50 p-8 transition-all duration-300 shadow-2xl">
          {/* Subtle overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Career Timeline</h3>
                  <p className="text-sm text-gray-400 font-mono flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                    REAL-TIME ACTIVITY & MILESTONES
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700/50">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-purple-400 font-mono">LIVE DATA</span>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 mb-8 bg-gray-800/50 p-1 rounded-xl border border-gray-700/50">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 px-4 py-3 text-xs font-medium rounded-lg transition-all duration-200 font-mono ${
                    activeTab === tab.id
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-lg'
                      : 'text-gray-400 hover:text-purple-300 hover:bg-gray-700/50'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Timeline */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => {
                  const Icon = getEventIcon(event.type);
                  const colorClass = getEventColor(event.type);
                  
                  return (
                    <div
                      key={event.id}
                      className="group relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                      <div className="relative bg-gray-800/50 backdrop-blur hover:bg-gray-800/70 rounded-xl p-5 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
                        <div className="flex items-start space-x-4">
                          <div className={`w-10 h-10 bg-gradient-to-r ${colorClass} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <span className="text-white font-medium">{event.title}</span>
                                <span className="text-xs px-2 py-1 bg-gray-700/50 rounded text-gray-300 font-mono uppercase border border-gray-600/50">
                                  {event.type}
                                </span>
                              </div>
                              <span className="text-xs text-gray-400 font-mono">{event.date}</span>
                            </div>
                            
                            <p className="text-sm text-gray-300 mb-3">{event.description}</p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {event.category && (
                                  <span className="text-xs text-gray-400 font-mono">
                                    {event.category}
                                  </span>
                                )}
                                {event.impact && (
                                  <div className="flex items-center space-x-1">
                                    <TrendingUp className="h-3 w-3 text-green-400" />
                                    <span className="text-xs text-green-400 font-mono">
                                      {event.impact}% IMPACT
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              {event.link && (
                                <a
                                  href={event.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-1 text-xs text-purple-400 hover:text-purple-300 transition-colors font-mono"
                                >
                                  <span>VIEW</span>
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 font-mono">NO TIMELINE DATA AVAILABLE</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

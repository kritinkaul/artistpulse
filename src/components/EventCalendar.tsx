'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Ticket, ExternalLink, Star, Users, AlertCircle } from 'lucide-react';
import { ticketmasterApi, TicketmasterEvent } from '@/lib/api-services';

interface EventCalendarProps {
  artistName: string;
}

export default function EventCalendar({ artistName }: EventCalendarProps) {
  const [events, setEvents] = useState<TicketmasterEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setError('');
        const eventsData = await ticketmasterApi.searchEvents(artistName);
        setEvents(eventsData);
      } catch (error: any) {
        console.error('Error fetching events:', error);
        if (error.message?.includes('401')) {
          setError('Ticketmaster API authentication failed. Please check configuration.');
        } else {
          setError('Failed to fetch events. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (artistName) {
      fetchEvents();
    }
  }, [artistName]);

  const formatDate = (dateString: string, timeString?: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    };
    
    let formatted = date.toLocaleDateString('en-US', options);
    
    if (timeString) {
      const time = new Date(`2000-01-01T${timeString}`);
      formatted += ` at ${time.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`;
    }
    
    return formatted;
  };

  const formatPrice = (priceRange: any) => {
    if (!priceRange || priceRange.length === 0) return 'TBD';
    
    const min = priceRange[0]?.min;
    const max = priceRange[0]?.max;
    const currency = priceRange[0]?.currency || 'USD';
    
    if (min && max) {
      return `${currency} ${min} - ${max}`;
    } else if (min) {
      return `${currency} ${min}+`;
    }
    
    return 'TBD';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'onsale':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
      case 'offsale':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      case 'cancelled':
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
      default:
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
    }
  };

  if (isLoading) {
    return (
      <div className="relative group">
        {/* Enhanced background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-75"></div>
        <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 transition-all duration-300 shadow-2xl">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative group">
        {/* Enhanced background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-75"></div>
        <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 hover:border-blue-500/50 p-8 transition-all duration-300 shadow-2xl">
          {/* Subtle overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Upcoming Events</h2>
                <p className="text-sm text-gray-400 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                  TOUR DATES & CONCERTS
                </p>
              </div>
            </div>
            
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Unable to Load Events</h3>
              <p className="text-sm text-gray-400">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Enhanced background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-75"></div>
      <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 hover:border-blue-500/50 p-8 transition-all duration-300 shadow-2xl">
        {/* Subtle overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Upcoming Events</h2>
                <p className="text-sm text-gray-400 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                  TOUR DATES & CONCERTS
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700/50">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="font-mono">{events.length} EVENTS</span>
            </div>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600/20 to-blue-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Upcoming Events</h3>
              <p className="text-sm text-gray-400">No scheduled concerts found for {artistName}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.slice(0, 5).map((event, index) => (
                <div key={event.id} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative bg-gray-800/50 backdrop-blur hover:bg-gray-800/70 rounded-xl p-5 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="font-bold text-white group-hover:text-blue-300 transition-colors">
                            {event.name}
                          </h3>
                          {index < 2 && (
                            <div className="w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                              <Star className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                              <Clock className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-blue-300 font-medium font-mono">
                              {formatDate(event.dates.start.localDate, event.dates.start.localTime)}
                            </span>
                          </div>
                          
                          {event._embedded?.venues?.[0] && (
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                                <MapPin className="h-3 w-3 text-white" />
                              </div>
                              <span className="text-green-300 font-medium font-mono">
                                {event._embedded.venues[0].name}, {event._embedded.venues[0].city.name}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                              <Ticket className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-purple-300 font-medium font-mono">
                              Price: {formatPrice(event.priceRanges)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-3">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-md ${getStatusColor(event.dates.status.code)}`}>
                          {event.dates.status.code === 'onsale' ? 'On Sale' : 
                           event.dates.status.code === 'offsale' ? 'Sold Out' :
                           event.dates.status.code === 'cancelled' ? 'Cancelled' : 'Coming Soon'}
                        </span>
                        
                        <a
                          href={event.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                    
                    {event.images?.[0] && (
                      <div className="mt-4">
                        <img 
                          src={event.images[0].url} 
                          alt={event.name}
                          className="w-full h-32 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-600/50"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
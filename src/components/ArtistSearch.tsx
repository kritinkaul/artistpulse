'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Play, Calendar, Globe, User } from 'lucide-react';
import { analyticsService, spotifyApi } from '@/lib/api-services';

interface ArtistSearchProps {
  onArtistFound: (data: any) => void;
}

export default function ArtistSearch({ onArtistFound }: ArtistSearchProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const placeholderSuggestions = [
    "Try searching Taylor Swift...",
    "Try searching Drake...",
    "Try searching BTS...",
    "Try searching The Weeknd...",
    "Try searching Ariana Grande...",
    "Try searching Billie Eilish...",
    "Try searching Post Malone...",
    "Try searching Dua Lipa..."
  ];

  // Debounced search for suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim() && query.length > 1 && !isSelecting) {
        setIsLoadingSuggestions(true);
        setShowDropdown(true);
        try {
          const artistSuggestions = await spotifyApi.getArtistSuggestions(query);
          setSuggestions(artistSuggestions);
          if (artistSuggestions.length > 0 && !isSelecting) {
            setShowDropdown(true);
          }
          setSelectedIndex(-1);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
          setShowDropdown(false);
        } finally {
          setIsLoadingSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, isSelecting]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Animated placeholder rotation
  useEffect(() => {
    if (!isTyping && query.length === 0) {
      const interval = setInterval(() => {
        setCurrentPlaceholder((prev) => (prev + 1) % placeholderSuggestions.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isTyping, query, placeholderSuggestions.length]);

  const handleSuggestionClick = async (artistName: string) => {
    setIsSelecting(true);
    setQuery(artistName);
    // Immediately close dropdown and clear everything
    setShowDropdown(false);
    setSelectedIndex(-1);
    setSuggestions([]);
    
    // Blur the input to prevent it from staying focused
    if (inputRef.current) {
      inputRef.current.blur();
    }
    
    // Automatically perform the search
    setIsLoading(true);
    setError('');

    try {
      const data = await analyticsService.getArtistAnalytics(artistName);
      
      // Check if we got at least some data (even if some APIs failed)
      if (data && (data.spotify || data.events?.length > 0 || data.videos?.length > 0 || 
                   data.news?.length > 0 || data.tweets?.length > 0 || data.redditPosts?.length > 0)) {
        onArtistFound(data);
      } else {
        setError('No artist found. Try a different search term.');
      }
    } catch (err: any) {
      console.error('Analytics service error:', err);
      setError('Failed to fetch artist data. Please try again.');
    } finally {
      setIsLoading(false);
      setIsSelecting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault();
          handleSuggestionClick(suggestions[selectedIndex].name);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        if (inputRef.current) {
          inputRef.current.blur();
        }
        break;
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const data = await analyticsService.getArtistAnalytics(query);
      
      // Check if we got at least some data (even if some APIs failed)
      if (data && (data.spotify || data.events?.length > 0 || data.videos?.length > 0 || 
                   data.news?.length > 0 || data.tweets?.length > 0 || data.redditPosts?.length > 0)) {
        onArtistFound(data);
      } else {
        setError('No artist found. Try a different search term.');
      }
    } catch (err: any) {
      console.error('Analytics service error:', err);
      setError('Failed to fetch artist data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-gray-900/30 to-slate-800/50 rounded-3xl blur-2xl"></div>
      
      <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 p-8 overflow-visible">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-3">ARTIST SEARCH INTERFACE</h2>
          <p className="text-slate-400 text-lg">Multi-platform intelligence gathering system</p>
        </div>
        
        <form onSubmit={handleSearch} className="mb-8">
          {/* Clean Search Container */}
          <div className="relative max-w-4xl mx-auto">
            {/* Elegant Search Input */}
            <div className="relative group search-input-focus" ref={searchRef}>
              {/* Refined glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-500"></div>
              
              {/* Main search container with clean design */}
              <div className="relative bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-slate-600/50 shadow-xl overflow-hidden">
                <div className="flex items-center">
                  {/* Elegant search icon */}
                  <div className="flex items-center justify-center w-16 h-16 ml-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                      <Search className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  {/* Clean input field */}
                  <div className="flex-1 px-4">
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setIsTyping(e.target.value.length > 0);
                      }}
                      onKeyDown={handleKeyDown}
                      onFocus={() => {
                        setIsTyping(true);
                        // Only show dropdown if we have a query and suggestions
                        if (query.length > 1 && suggestions.length > 0) {
                          setShowDropdown(true);
                        }
                      }}
                      onBlur={(e) => {
                        // Don't close dropdown if clicking on a suggestion
                        const relatedTarget = e.relatedTarget as HTMLElement;
                        if (relatedTarget && searchRef.current?.contains(relatedTarget)) {
                          return;
                        }
                        
                        // Delay to allow click events to fire first
                        setTimeout(() => {
                          setIsTyping(query.length > 0);
                          setShowDropdown(false);
                          setSelectedIndex(-1);
                        }, 150);
                      }}
                      placeholder={query.length === 0 ? placeholderSuggestions[currentPlaceholder] : ""}
                      className="w-full h-16 bg-transparent text-lg font-medium text-white placeholder-slate-400 focus:outline-none transition-all duration-300"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Modern analyze button */}
                  <div className="pr-3">
                    <button
                      type="submit"
                      disabled={isLoading || !query.trim()}
                      className="relative overflow-hidden px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4" />
                          <span>Analyze</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Clean dropdown suggestions */}
              {showDropdown && (suggestions.length > 0 || isLoadingSuggestions) && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 rounded-xl shadow-2xl z-[9999] max-h-80 overflow-y-auto">
                  {isLoadingSuggestions ? (
                    <div className="p-6 text-center">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto text-cyan-400" />
                      <p className="text-sm text-slate-400 mt-3">Searching artists...</p>
                    </div>
                  ) : (
                    suggestions.map((artist, index) => (
                      <button
                        key={artist.id}
                        type="button"
                        onMouseDown={(e) => {
                          // Prevent the input from losing focus
                          e.preventDefault();
                          // Immediately handle the click
                          handleSuggestionClick(artist.name);
                        }}
                        className={`w-full text-left p-4 hover:bg-slate-700/50 transition-all duration-200 flex items-center gap-4 border-b border-slate-700/30 last:border-b-0 ${
                          index === selectedIndex ? 'bg-slate-700/70' : ''
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {artist.image ? (
                            <img
                              src={artist.image}
                              alt={artist.name}
                              className="w-12 h-12 rounded-full object-cover shadow-md border border-slate-600/50"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                              <User className="h-6 w-6 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white truncate">{artist.name}</p>
                          {artist.followers && (
                            <p className="text-sm text-slate-400">
                              {(artist.followers / 1000000).toFixed(1)}M followers
                            </p>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </form>

        {error && (
          <div className="max-w-2xl mx-auto p-4 bg-red-900/30 border border-red-500/30 rounded-xl">
            <p className="text-red-400 text-center font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
} 
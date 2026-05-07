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
      {/* Enhanced Musical Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-neon-purple/10 to-neon-pink/10 rounded-3xl blur-3xl animate-pulse-glow"></div>
      
      <div className="relative glass-strong rounded-3xl shadow-2xl border-2 border-neon-cyan/30 p-10 overflow-visible hover:border-neon-cyan/60 transition-all duration-500">
        {/* Title Section with Musical Theme */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            <span className="text-gradient-animate">🎵 ARTIST SEARCH 🎵</span>
          </h2>
          <p className="text-gray-300 text-lg font-mono">Multi-platform Intelligence Gathering System</p>
        </div>
        
        <form onSubmit={handleSearch} className="mb-8">
          {/* Enhanced Search Container */}
          <div className="relative max-w-4xl mx-auto">
            {/* Musical Search Input */}
            <div className="relative group" ref={searchRef}>
              {/* Enhanced glow effect with musical colors */}
              <div className="absolute -inset-2 bg-gradient-to-r from-neon-cyan/30 via-neon-purple/30 to-neon-pink/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-500 animate-pulse-glow"></div>
              
              {/* Main search container with premium glassmorphism */}
              <div className="relative glass-musical rounded-3xl border-2 border-neon-cyan/40 shadow-neon-cyan overflow-hidden hover:border-neon-cyan/80 transition-all duration-500">
                {/* Animated scan line effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-purple/10 to-transparent animate-shimmer-musical pointer-events-none"></div>
                
                <div className="relative flex items-center">
                  {/* Enhanced Musical Search Icon */}
                  <div className="flex items-center justify-center w-20 h-20 ml-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-neon-cyan/30 rounded-2xl blur-lg animate-pulse"></div>
                      <div className="relative w-12 h-12 bg-gradient-to-br from-neon-cyan via-neon-purple to-neon-pink rounded-2xl flex items-center justify-center shadow-neon-cyan">
                        <Search className="h-6 w-6 text-white drop-shadow-lg" />
                      </div>
                    </div>
                  </div>

                  {/* Enhanced input field */}
                  <div className="flex-1 px-6">
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
                      className="w-full h-20 bg-transparent text-xl font-semibold text-white placeholder-gray-400/60 focus:outline-none transition-all duration-300"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Enhanced Musical Analyze Button */}
                  <div className="pr-5">
                    <button
                      type="submit"
                      disabled={isLoading || !query.trim()}
                      className="relative group overflow-hidden px-8 py-4 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink text-white rounded-2xl hover:shadow-neon-cyan disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-3 font-bold text-lg shadow-xl transform hover:scale-105 transition-all duration-500"
                      style={{ fontFamily: "'Orbitron', sans-serif" }}
                    >
                      {/* Animated Background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10 flex items-center gap-3">
                        {isLoading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <Search className="h-5 w-5" />
                            <span>ANALYZE</span>
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              {/* Enhanced dropdown suggestions with musical theme */}
              {showDropdown && (suggestions.length > 0 || isLoadingSuggestions) && (
                <div className="absolute top-full left-0 right-0 mt-4 glass-musical border-2 border-neon-purple/40 rounded-2xl shadow-neon-purple z-[9999] max-h-80 overflow-y-auto">
                  {isLoadingSuggestions ? (
                    <div className="p-8 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-neon-cyan" />
                      <p className="text-sm text-gray-300 mt-4 font-mono">Searching artists...</p>
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
                        className={`w-full text-left p-5 hover:bg-neon-cyan/10 transition-all duration-300 flex items-center gap-5 border-b border-neon-purple/20 last:border-b-0 ${
                          index === selectedIndex ? 'bg-neon-purple/20' : ''
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {artist.image ? (
                            <div className="relative">
                              <div className="absolute inset-0 bg-neon-cyan/30 rounded-full blur-md"></div>
                              <img
                                src={artist.image}
                                alt={artist.name}
                                className="relative w-14 h-14 rounded-full object-cover shadow-neon-cyan border-2 border-neon-cyan/40"
                              />
                            </div>
                          ) : (
                            <div className="relative">
                              <div className="absolute inset-0 bg-neon-cyan/30 rounded-full blur-md"></div>
                              <div className="relative w-14 h-14 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-full flex items-center justify-center shadow-neon-cyan">
                                <User className="h-7 w-7 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white truncate text-lg">{artist.name}</p>
                          {artist.followers && (
                            <p className="text-sm text-neon-cyan font-mono">
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
          <div className="max-w-2xl mx-auto p-5 glass-musical border-2 border-red-500/50 rounded-2xl shadow-lg">
            <p className="text-red-400 text-center font-bold text-lg">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
} 
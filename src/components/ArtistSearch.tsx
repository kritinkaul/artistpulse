'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, User } from 'lucide-react';
import { analyticsService, spotifyApi } from '@/lib/api-services';

interface ArtistSearchProps {
  onArtistFound: (data: any) => void;
}

interface ArtistSuggestion {
  id?: string;
  name: string;
  image?: string;
  followers?: number;
}

function hasUsableArtistData(data: any): boolean {
  if (!data) return false;

  const spotifyArtist = data.spotify?.artist;
  const hasSpotify = Boolean(spotifyArtist?.id || spotifyArtist?.name);
  const hasEvents = Array.isArray(data.events) && data.events.length > 0;
  const hasVideos = Array.isArray(data.videos) && data.videos.length > 0;
  const hasNews = Array.isArray(data.news) && data.news.length > 0;
  const hasTweets = Array.isArray(data.tweets) && data.tweets.length > 0;
  const hasReddit = Array.isArray(data.redditPosts) && data.redditPosts.length > 0;
  const hasLastfm = Boolean(data.lastfm?.artist?.name);

  return hasSpotify || hasEvents || hasVideos || hasNews || hasTweets || hasReddit || hasLastfm;
}

function formatFollowers(count: number) {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M followers`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K followers`;
  return `${count} followers`;
}

export default function ArtistSearch({ onArtistFound }: ArtistSearchProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<ArtistSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [suppressSuggestions, setSuppressSuggestions] = useState(false);
  const [listMaxHeight, setListMaxHeight] = useState(280);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestIdRef = useRef(0);

  const placeholderSuggestions = [
    "Try Taylor Swift...",
    "Try Drake...",
    "Try BTS...",
    "Try The Weeknd...",
    "Try Ariana Grande...",
    "Try Billie Eilish...",
    "Try Post Malone...",
    "Try Dua Lipa..."
  ];

  useEffect(() => {
    const updateListHeight = () => {
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const top = searchRef.current?.getBoundingClientRect().bottom ?? 180;
      const available = Math.floor(viewportHeight - top - 16);
      setListMaxHeight(Math.max(160, Math.min(320, available)));
    };

    updateListHeight();
    window.visualViewport?.addEventListener('resize', updateListHeight);
    window.addEventListener('resize', updateListHeight);
    return () => {
      window.visualViewport?.removeEventListener('resize', updateListHeight);
      window.removeEventListener('resize', updateListHeight);
    };
  }, [showDropdown, query]);

  useEffect(() => {
    if (suppressSuggestions || isSelecting) {
      return;
    }

    if (!query.trim() || query.length <= 1) {
      setSuggestions([]);
      setShowDropdown(false);
      setSelectedIndex(-1);
      setIsLoadingSuggestions(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    const timer = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      setShowDropdown(true);
      try {
        const artistSuggestions = await spotifyApi.getArtistSuggestions(query);
        if (requestId !== requestIdRef.current) return;
        setSuggestions(artistSuggestions);
        setShowDropdown(true);
        setSelectedIndex(-1);
      } catch (err) {
        if (requestId !== requestIdRef.current) return;
        console.error('Error fetching suggestions:', err);
        setSuggestions([]);
        setShowDropdown(true);
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoadingSuggestions(false);
        }
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      requestIdRef.current += 1;
    };
  }, [query, isSelecting, suppressSuggestions]);

  useEffect(() => {
    const handlePointerOutside = (event: Event) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('pointerdown', handlePointerOutside);
    return () => document.removeEventListener('pointerdown', handlePointerOutside);
  }, []);

  useEffect(() => {
    if (!isTyping && query.length === 0) {
      const interval = setInterval(() => {
        setCurrentPlaceholder((prev) => (prev + 1) % placeholderSuggestions.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isTyping, query, placeholderSuggestions.length]);

  const runArtistSearch = async (artistName: string) => {
    const trimmed = artistName.trim();
    if (!trimmed) return;

    setIsSelecting(true);
    setSuppressSuggestions(true);
    setShowDropdown(false);
    setSelectedIndex(-1);
    setSuggestions([]);
    setIsLoadingSuggestions(false);
    setIsLoading(true);
    setError('');

    if (inputRef.current) {
      inputRef.current.blur();
    }

    try {
      const data = await analyticsService.getArtistAnalytics(trimmed);

      if (hasUsableArtistData(data)) {
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

  const handleSuggestionClick = async (artistName: string) => {
    setQuery(artistName);
    await runArtistSearch(artistName);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (!showDropdown || suggestions.length === 0 || selectedIndex < 0)) {
      return;
    }

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
        e.preventDefault();
        handleSuggestionClick(suggestions[selectedIndex].name);
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
    if (!query.trim() || isLoading) return;
    await runArtistSearch(query);
  };

  const showSuggestionPanel = showDropdown && query.trim().length > 1 && !suppressSuggestions;

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-gray-900/30 to-slate-800/50 rounded-2xl md:rounded-3xl blur-2xl pointer-events-none"></div>

      <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-slate-700/50 p-4 md:p-8 overflow-visible">
        <div className="text-center mb-4 md:mb-8">
          <h2 className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-3">ARTIST SEARCH INTERFACE</h2>
          <p className="text-slate-400 text-sm md:text-lg">Multi-platform intelligence gathering system</p>
        </div>

        <form onSubmit={handleSearch} className="mb-2 md:mb-8">
          <div className="max-w-4xl mx-auto" ref={searchRef}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 rounded-2xl blur-lg opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transition-all duration-500 pointer-events-none"></div>

              <div className="relative bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-slate-600/50 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="flex items-center justify-center w-11 h-12 md:w-16 md:h-16 ml-2 md:ml-4 shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                        <Search className="h-4 w-4 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 pr-3 md:px-4">
                      <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => {
                          setQuery(e.target.value);
                          setIsTyping(e.target.value.length > 0);
                          setSuppressSuggestions(false);
                          setError('');
                        }}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                          setIsTyping(true);
                          if (!suppressSuggestions && query.length > 1) {
                            setShowDropdown(true);
                          }
                          window.setTimeout(() => {
                            searchRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
                          }, 50);
                        }}
                        placeholder={query.length === 0 ? placeholderSuggestions[currentPlaceholder] : ""}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        enterKeyHint="search"
                        inputMode="search"
                        aria-label="Search for an artist"
                        aria-expanded={showSuggestionPanel}
                        aria-controls="artist-search-suggestions"
                        className="artist-search-input w-full h-12 md:h-16 bg-transparent text-base md:text-lg font-medium text-white placeholder-slate-400 focus:outline-none"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="px-3 pb-3 md:p-0 md:pr-3 shrink-0">
                    <button
                      type="submit"
                      disabled={isLoading || !query.trim()}
                      className="relative w-full md:w-auto min-h-12 px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-lg touch-manipulation"
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
            </div>

            {showSuggestionPanel && (
              <div
                id="artist-search-suggestions"
                role="listbox"
                className="relative mt-2 bg-slate-800 border border-slate-600/50 rounded-xl shadow-2xl z-50 overflow-y-auto overscroll-contain"
                style={{ maxHeight: listMaxHeight }}
              >
                {isLoadingSuggestions && suggestions.length === 0 ? (
                  <div className="p-5 text-center">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-cyan-400" />
                    <p className="text-sm text-slate-400 mt-3">Searching artists...</p>
                  </div>
                ) : suggestions.length === 0 ? (
                  <div className="p-5 text-center">
                    <p className="text-sm text-slate-300 font-medium">No matching artists</p>
                    <p className="text-xs text-slate-500 mt-1">Try a fuller name, then tap Analyze</p>
                  </div>
                ) : (
                  <>
                    {isLoadingSuggestions && (
                      <div className="px-4 py-2 text-xs text-cyan-400 border-b border-slate-700/40 flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Updating results...
                      </div>
                    )}
                    {suggestions.map((artist, index) => (
                      <button
                        key={artist.id || `${artist.name}-${index}`}
                        type="button"
                        role="option"
                        aria-selected={index === selectedIndex}
                        onPointerDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSuggestionClick(artist.name);
                        }}
                        className={`w-full text-left px-3 py-3 md:p-4 hover:bg-slate-700/50 flex items-center gap-3 border-b border-slate-700/30 last:border-b-0 min-h-14 touch-manipulation ${
                          index === selectedIndex ? 'bg-slate-700/70' : ''
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {artist.image ? (
                            <img
                              src={artist.image}
                              alt=""
                              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-md border border-slate-600/50"
                            />
                          ) : (
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                              <User className="h-5 w-5 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white truncate">{artist.name}</p>
                          {artist.followers ? (
                            <p className="text-sm text-slate-400">{formatFollowers(artist.followers)}</p>
                          ) : null}
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
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

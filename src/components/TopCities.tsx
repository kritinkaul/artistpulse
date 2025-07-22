'use client';

import { useState, useEffect } from 'react';
import { MapPin, TrendingUp, Users, Loader2, Globe } from 'lucide-react';

interface CityData {
  city: string;
  country: string;
  popularity: number;
  trending: boolean;
  listeners: number;
}

interface TopCitiesProps {
  artistName: string;
}

export default function TopCities({ artistName }: TopCitiesProps) {
  const [cities, setCities] = useState<CityData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (artistName) {
      fetchTopCities();
    }
  }, [artistName]);

  const fetchTopCities = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/lastfm/geo?artist=${encodeURIComponent(artistName)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch city data');
      }
      const data = await response.json();
      setCities(data.topCities || []);
    } catch (err) {
      setError('Failed to load top cities data');
      console.error('Error fetching top cities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getCityIcon = (city: string, country: string) => {
    const key = `${city.toLowerCase()}-${country.toLowerCase()}`;
    const cityIcons: { [key: string]: React.ReactElement } = {
      'los angeles-united states': (
        <div className="text-lg">🌴</div>
      ),
      'new york-united states': (
        <div className="text-lg">🗽</div>
      ),
      'london-united kingdom': (
        <div className="text-lg">🏰</div>
      ),
      'paris-france': (
        <div className="text-lg">🗼</div>
      ),
      'tokyo-japan': (
        <div className="text-lg">🗾</div>
      ),
      'berlin-germany': (
        <div className="text-lg">🏛️</div>
      ),
      'sydney-australia': (
        <div className="text-lg">🦘</div>
      ),
      'toronto-canada': (
        <div className="text-lg">🍁</div>
      ),
      'vancouver-canada': (
        <div className="text-lg">🏔️</div>
      ),
      'mumbai-india': (
        <div className="text-lg">🏙️</div>
      ),
      'delhi-india': (
        <div className="text-lg">🏛️</div>
      ),
      'kolkata-india': (
        <div className="text-lg">🎭</div>
      ),
      'bangalore-india': (
        <div className="text-lg">💻</div>
      ),
      'hyderabad-india': (
        <div className="text-lg">💎</div>
      ),
      'chennai-india': (
        <div className="text-lg">🎬</div>
      ),
      'pune-india': (
        <div className="text-lg">🎓</div>
      ),
      'ahmedabad-india': (
        <div className="text-lg">🧵</div>
      ),
      'jaipur-india': (
        <div className="text-lg">🏰</div>
      ),
      'seoul-south korea': (
        <div className="text-lg">🏙️</div>
      ),
      'busan-south korea': (
        <div className="text-lg">🌊</div>
      ),
      'manila-philippines': (
        <div className="text-lg">🏝️</div>
      ),
      'jakarta-indonesia': (
        <div className="text-lg">🌴</div>
      ),
      'bangkok-thailand': (
        <div className="text-lg">🛕</div>
      ),
      'bogotá-colombia': (
        <div className="text-lg">☕</div>
      ),
      'san juan-puerto rico': (
        <div className="text-lg">🏖️</div>
      ),
      'buenos aires-argentina': (
        <div className="text-lg">💃</div>
      ),
      'mexico city-mexico': (
        <div className="text-lg">🌵</div>
      ),
      'madrid-spain': (
        <div className="text-lg">🏛️</div>
      ),
    };

    return cityIcons[key] || (
      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
        <MapPin className="h-4 w-4 text-white" />
      </div>
    );
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="relative group">
        {/* Enhanced background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-75"></div>
        <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 transition-all duration-300 shadow-2xl">
          <div className="flex items-center justify-center space-x-2 text-cyan-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm font-mono">LOADING TOP CITIES...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative group">
        {/* Enhanced background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-75"></div>
        <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-red-500/30 p-8 transition-all duration-300 shadow-2xl">
          <div className="text-red-400 text-sm font-mono text-center">{error}</div>
        </div>
      </div>
    );
  }

  if (!cities || cities.length === 0) {
    return (
      <div className="relative group">
        {/* Enhanced background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-75"></div>
        <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 transition-all duration-300 shadow-2xl">
          <div className="text-gray-400 text-sm font-mono text-center">No city data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Enhanced background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-75"></div>
      <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 hover:border-purple-500/50 p-8 transition-all duration-300 shadow-2xl">
        {/* Subtle overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Top Cities</h3>
                <p className="text-sm text-gray-400 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                  POPULARITY HEATMAP
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700/50">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400 font-mono">ESTIMATED DATA</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.map((city, index) => (
              <div
                key={`${city.city}-${city.country}`}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-gray-800/50 backdrop-blur rounded-xl p-5 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg font-bold text-cyan-400">#{index + 1}</div>
                      {getCityIcon(city.city, city.country)}
                      <div>
                        <div className="font-medium text-white text-sm">{city.city}</div>
                        <div className="text-xs text-gray-400 font-mono">{city.country.toUpperCase()}</div>
                      </div>
                    </div>
                    {city.trending && (
                      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-mono shadow-lg">
                        TRENDING
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 font-mono">LISTENERS</span>
                      <span className="text-xs text-cyan-300 font-mono">{formatNumber(city.listeners)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 font-mono">POPULARITY</span>
                      <span className="text-xs text-purple-300 font-mono">{city.popularity}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${city.popularity}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

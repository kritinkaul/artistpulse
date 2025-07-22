'use client';

import { useState, useEffect } from 'react';
import { Play, ThumbsUp, MessageCircle, Eye, ExternalLink, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { youtubeApi, YouTubeVideo } from '@/lib/api-services';

interface YouTubeAnalyticsProps {
  artistName: string;
}

export default function YouTubeAnalytics({ artistName }: YouTubeAnalyticsProps) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const fetchVideos = async () => {
    try {
      setError('');
      setIsLoading(true);
      const videosData = await youtubeApi.searchVideos(artistName, 8);
      setVideos(videosData);
      setRetryCount(0); // Reset retry count on success
    } catch (error: any) {
      console.error('Error fetching YouTube videos:', error);
      
      // Show more specific error messages based on the error type
      if (error.message?.includes('quota exceeded')) {
        setError('YouTube API quota exceeded. This limit resets daily at midnight PST.');
      } else if (error.message?.includes('API key')) {
        setError('YouTube API configuration issue. Please contact support.');
      } else if (error.message?.includes('Network')) {
        setError('Network error. Please check your internet connection.');
      } else {
        setError('Failed to fetch YouTube data. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchVideos();
  };

  useEffect(() => {
    if (artistName) {
      fetchVideos();
    }
  }, [artistName]);

  const formatNumber = (num: string) => {
    const number = parseInt(num);
    if (number >= 1000000000) {
      const billions = number / 1000000000;
      return billions % 1 === 0 ? billions.toFixed(0) + 'B' : billions.toFixed(1) + 'B';
    } else if (number >= 1000000) {
      const millions = number / 1000000;
      return millions % 1 === 0 ? millions.toFixed(0) + 'M' : millions.toFixed(1) + 'M';
    } else if (number >= 1000) {
      const thousands = number / 1000;
      return thousands % 1 === 0 ? thousands.toFixed(0) + 'K' : thousands.toFixed(1) + 'K';
    }
    return number.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const getTotalStats = () => {
    return videos.reduce((acc, video) => {
      acc.views += parseInt(video.statistics.viewCount || '0');
      acc.likes += parseInt(video.statistics.likeCount || '0');
      acc.comments += parseInt(video.statistics.commentCount || '0');
      return acc;
    }, { views: 0, likes: 0, comments: 0 });
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 cyber-glow">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const isQuotaError = error.includes('quota exceeded');
    const isConfigError = error.includes('configuration issue');
    
    return (
      <div className="bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 cyber-glow">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg cyber-glow">
            <Play className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">YouTube Analytics</h2>
            <p className="text-sm text-gray-400">Video performance & engagement</p>
          </div>
        </div>
        
        <div className="text-center py-12">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
            isQuotaError 
              ? 'bg-gradient-to-r from-yellow-100 to-yellow-200' 
              : 'bg-gradient-to-r from-red-100 to-red-200'
          }`}>
            <AlertCircle className={`h-8 w-8 ${
              isQuotaError ? 'text-yellow-600' : 'text-red-600'
            }`} />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isQuotaError ? 'API Quota Exceeded' : 'Unable to Load YouTube Data'}
          </h3>
          
          <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
            {error}
          </p>
          
          {isQuotaError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 max-w-md mx-auto">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> YouTube API has strict daily quotas. The quota typically resets at midnight PST.
              </p>
            </div>
          )}
          
          {!isConfigError && (
            <button
              onClick={handleRetry}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Retrying...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4" />
                  Retry {retryCount > 0 && `(${retryCount})`}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  const totalStats = getTotalStats();

  return (
    <div className="bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 cyber-glow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg cyber-glow">
            <Play className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">YouTube Analytics</h2>
            <p className="text-sm text-gray-400">Video performance & engagement</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700/50">
          <TrendingUp className="h-4 w-4" />
          <span>{videos.length} videos found</span>
        </div>
      </div>

      {/* Total Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-800/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div className="relative bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-red-500/30 hover:border-red-400/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <Eye className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-red-400">Total Views</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatNumber(totalStats.views.toString())}
            </p>
            <p className="text-xs text-gray-400 mt-1">Across all videos</p>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-green-800/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div className="relative bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-green-500/30 hover:border-green-400/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <ThumbsUp className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-green-400">Total Likes</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatNumber(totalStats.likes.toString())}
            </p>
            <p className="text-xs text-gray-400 mt-1">User engagement</p>
          </div>
        </div>

        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-800/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div className="relative bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-blue-400">Comments</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatNumber(totalStats.comments.toString())}
            </p>
            <p className="text-xs text-gray-400 mt-1">Community interaction</p>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Top Videos</h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Play className="h-4 w-4" />
            <span>Most Popular</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.slice(0, 6).map((video, index) => (
            <div key={`${video.id}-${index}`} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-red-800/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-gray-800/70 backdrop-blur-sm hover:bg-gray-800/90 rounded-xl overflow-hidden border border-gray-700/50 hover:border-red-500/50 transition-all duration-300 cyber-glow">
                <div className="relative">
                  <img 
                    src={video.snippet.thumbnails.medium.url} 
                    alt={video.snippet.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg font-medium">
                    {formatNumber(video.statistics.viewCount || '0')} views
                  </div>
                  {index < 2 && (
                    <div className="absolute top-2 left-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">🔥</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h4 className="font-bold text-white text-sm line-clamp-2 mb-3 group-hover:text-red-400 transition-colors">
                    {video.snippet.title}
                  </h4>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span className="font-medium text-gray-300">{video.snippet.channelTitle}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(video.snippet.publishedAt)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        <span className="font-medium">{formatNumber(video.statistics.likeCount || '0')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        <span className="font-medium">{formatNumber(video.statistics.commentCount || '0')}</span>
                      </div>
                    </div>
                    
                    <a
                      href={`https://www.youtube.com/watch?v=${video.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white text-xs font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                      title="Watch on YouTube"
                    >
                      <svg 
                        className="h-3 w-3" 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                      >
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      <span className="hidden sm:inline">YouTube</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
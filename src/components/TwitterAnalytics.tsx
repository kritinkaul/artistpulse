'use client';

import { useState, useEffect } from 'react';
import { Twitter, Heart, MessageCircle, Repeat, ExternalLink, Verified, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { twitterApi, TwitterTweet } from '@/lib/api-services';

interface TwitterAnalyticsProps {
  artistName: string;
}

export default function TwitterAnalytics({ artistName }: TwitterAnalyticsProps) {
  const [tweets, setTweets] = useState<TwitterTweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const fetchTweets = async () => {
    try {
      setError('');
      setIsLoading(true);
      const tweetsData = await twitterApi.searchTweets(artistName, 8);
      setTweets(tweetsData);
      setRetryCount(0); // Reset retry count on success
    } catch (error: any) {
      console.error('Error fetching Twitter data:', error);
      
      // Show more specific error messages based on the error type
      if (error.message?.includes('rate limit')) {
        setError('Twitter API rate limit exceeded. Please try again in 15 minutes.');
      } else if (error.message?.includes('authentication')) {
        setError('Twitter API authentication issue. Please contact support.');
      } else if (error.message?.includes('Network')) {
        setError('Network error. Please check your internet connection.');
      } else {
        setError('Failed to fetch Twitter data. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchTweets();
  };

  useEffect(() => {
    if (artistName) {
      fetchTweets();
    }
  }, [artistName]);

  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      const billions = num / 1000000000;
      return billions % 1 === 0 ? billions.toFixed(0) + 'B' : billions.toFixed(1) + 'B';
    } else if (num >= 1000000) {
      const millions = num / 1000000;
      return millions % 1 === 0 ? millions.toFixed(0) + 'M' : millions.toFixed(1) + 'M';
    } else if (num >= 1000) {
      const thousands = num / 1000;
      return thousands % 1 === 0 ? thousands.toFixed(0) + 'K' : thousands.toFixed(1) + 'K';
    }
    return num.toString();
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

  const getTotalEngagement = () => {
    return tweets.reduce((total, tweet) => {
      return total + tweet.public_metrics.like_count + 
             tweet.public_metrics.retweet_count + 
             tweet.public_metrics.reply_count;
    }, 0);
  };

  const getMostEngagedTweet = () => {
    if (tweets.length === 0) return null;
    return tweets.reduce((mostEngaged, tweet) => {
      const tweetEngagement = tweet.public_metrics.like_count + 
                            tweet.public_metrics.retweet_count + 
                            tweet.public_metrics.reply_count;
      const mostEngagedTotal = mostEngaged.public_metrics.like_count + 
                              mostEngaged.public_metrics.retweet_count + 
                              mostEngaged.public_metrics.reply_count;
      return tweetEngagement > mostEngagedTotal ? tweet : mostEngaged;
    });
  };

  if (isLoading) {
    return (
      <div className="relative group">
        {/* Enhanced background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-blue-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-75"></div>
        <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 transition-all duration-300 shadow-2xl">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-700 rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const isRateLimitError = error.includes('rate limit');
    const isConfigError = error.includes('authentication');
    
    return (
      <div className="relative group">
        {/* Enhanced background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-blue-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-75"></div>
        <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 hover:border-blue-500/50 p-8 transition-all duration-300 shadow-2xl">
          {/* Subtle overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Twitter className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Twitter Analytics</h2>
                <p className="text-sm text-gray-400 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                  SOCIAL MEDIA BUZZ
                </p>
              </div>
            </div>
            
            <div className="text-center py-12">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                isRateLimitError 
                  ? 'bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 border border-yellow-500/30' 
                  : 'bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30'
              }`}>
                <AlertCircle className={`h-8 w-8 ${
                  isRateLimitError ? 'text-yellow-400' : 'text-red-400'
                }`} />
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">
                {isRateLimitError ? 'Rate Limit Exceeded' : 'Unable to Load Twitter Data'}
              </h3>
              
              <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
                {error}
              </p>
              
              {isRateLimitError && (
                <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <p className="text-sm text-yellow-300">
                    <strong>Note:</strong> Twitter API has strict rate limits. Please wait 15 minutes before trying again.
                  </p>
                </div>
              )}
              
              {!isConfigError && (
                <button
                  onClick={handleRetry}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
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
        </div>
      </div>
    );
  }

  const totalEngagement = getTotalEngagement();
  const mostEngaged = getMostEngagedTweet();

  return (
    <div className="relative group">
      {/* Enhanced background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-blue-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-75"></div>
      <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 hover:border-blue-500/50 p-8 transition-all duration-300 shadow-2xl">
        {/* Subtle overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Twitter className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Twitter Analytics</h2>
                <p className="text-sm text-gray-400 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                  SOCIAL MEDIA BUZZ
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700/50">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span className="font-mono">{tweets.length} TWEETS</span>
            </div>
          </div>

          {/* Total Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-800/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-blue-400 font-mono">TOTAL ENGAGEMENT</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  {formatNumber(totalEngagement)}
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-green-800/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Repeat className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-green-400 font-mono">TOTAL RETWEETS</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  {formatNumber(tweets.reduce((sum, tweet) => sum + tweet.public_metrics.retweet_count, 0))}
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-800/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-purple-400 font-mono">TOTAL REPLIES</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  {formatNumber(tweets.reduce((sum, tweet) => sum + tweet.public_metrics.reply_count, 0))}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Tweets */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white font-mono">RECENT TWEETS</h3>
              <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700/50">
                <Twitter className="h-4 w-4 text-blue-400" />
                <span className="font-mono">LATEST MENTIONS</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {tweets.slice(0, 6).map((tweet, index) => (
                <div key={`${tweet.id}-${index}`} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative bg-gray-800/50 backdrop-blur hover:bg-gray-800/70 rounded-xl p-5 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-200">
                    {/* Tweet Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={tweet.author.profile_image_url || '/default-avatar.png'} 
                          alt={tweet.author.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/30"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-sm">{tweet.author.name}</h4>
                            {tweet.author.verified && (
                              <Verified className="h-4 w-4 text-blue-400" />
                            )}
                          </div>
                          <p className="text-sm text-gray-400 font-mono">@{tweet.author.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(tweet.created_at)}</span>
                      </div>
                    </div>
                    
                    {/* Tweet Content */}
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">{tweet.text}</p>
                    
                    {/* Tweet Metrics */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-xs text-red-400">
                          <Heart className="h-3 w-3" />
                          <span className="font-mono">{formatNumber(tweet.public_metrics.like_count)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-green-400">
                          <Repeat className="h-3 w-3" />
                          <span className="font-mono">{formatNumber(tweet.public_metrics.retweet_count)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-blue-400">
                          <MessageCircle className="h-3 w-3" />
                          <span className="font-mono">{formatNumber(tweet.public_metrics.reply_count)}</span>
                        </div>
                      </div>
                      
                      <a 
                        href={`https://twitter.com/${tweet.author.username}/status/${tweet.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span className="font-mono">VIEW</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

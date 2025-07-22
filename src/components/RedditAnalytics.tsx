'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, ArrowUp, ArrowDown, ExternalLink, Users, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { redditApi, RedditPost } from '@/lib/api-services';

interface RedditAnalyticsProps {
  artistName: string;
}

export default function RedditAnalytics({ artistName }: RedditAnalyticsProps) {
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const fetchPosts = async () => {
    try {
      setError('');
      setIsLoading(true);
      const postsData = await redditApi.searchPosts(artistName, 8);
      setPosts(postsData);
      setRetryCount(0); // Reset retry count on success
    } catch (error: any) {
      console.error('Error fetching Reddit data:', error);
      
      // Show more specific error messages based on the error type
      if (error.message?.includes('rate limit')) {
        setError('Reddit API rate limit exceeded. Please try again later.');
      } else if (error.message?.includes('authentication')) {
        setError('Reddit API authentication issue. Please contact support.');
      } else if (error.message?.includes('Network')) {
        setError('Network error. Please check your internet connection.');
      } else {
        setError('Failed to fetch Reddit data. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchPosts();
  };

  useEffect(() => {
    if (artistName) {
      fetchPosts();
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

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
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
    return posts.reduce((totals, post) => ({
      upvotes: totals.upvotes + post.ups,
      comments: totals.comments + post.num_comments,
      score: totals.score + post.score
    }), { upvotes: 0, comments: 0, score: 0 });
  };

  const getTopSubreddits = () => {
    const subredditCounts = posts.reduce((acc, post) => {
      acc[post.subreddit] = (acc[post.subreddit] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(subredditCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  if (isLoading) {
    return (
      <div className="relative group">
        {/* Enhanced background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-600/20 via-red-600/20 to-pink-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-75"></div>
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
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-600/20 via-red-600/20 to-pink-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-75"></div>
        <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 hover:border-orange-500/50 p-8 transition-all duration-300 shadow-2xl">
          {/* Subtle overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  {/* Reddit Logo SVG */}
                  <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.238 15.348c.085-.08.085-.221 0-.299-.888-.789-2.563-.789-3.451 0-.085.078-.085.219 0 .299.088.082.233.082.321 0 .662-.599 1.867-.599 2.529 0 .088.082.233.082.321 0zm-3.44-.984c0-.599-.485-1.084-1.084-1.084-.599 0-1.084.485-1.084 1.084 0 .599.485 1.084 1.084 1.084.599 0 1.084-.485 1.084-1.084zm5.448 0c0-.599-.485-1.084-1.084-1.084-.599 0-1.084.485-1.084 1.084 0 .599.485 1.084 1.084 1.084.599 0 1.084-.485 1.084-1.084zm-.321 4.235c-.78.78-2.048.78-2.829 0-.2-.2-.2-.524 0-.724.2-.2.524-.2.724 0 .384.384 1.581.384 1.965 0 .2-.2.524-.2.724 0 .2.2.2.524 0 .724zm5.058-6.234c0 .842-.681 1.524-1.524 1.524-.293 0-.568-.084-.804-.229-.789.599-1.876.969-3.148 1.078l.535-2.515 1.749.371c0 .568.461 1.029 1.029 1.029.568 0 1.029-.461 1.029-1.029s-.461-1.029-1.029-1.029c-.414 0-.771.245-.932.596l-1.949-.413c-.069-.015-.142-.002-.198.035-.057.037-.095.092-.108.155l-.592 2.788c-1.295-.109-2.408-.486-3.218-1.093-.236.146-.511.229-.804.229-.843 0-1.524-.681-1.524-1.524 0-.694.467-1.28 1.103-1.455.014-.189.033-.379.056-.568C2.775 8.924 4.204 6.229 7.26 4.669c.329-.168.73-.025.898.304.168.329.025.73-.304.898-2.616 1.334-3.803 3.548-3.461 5.694.026.168.048.337.065.507.605-.316 1.346-.516 2.147-.595l.535-2.515c.069-.325.328-.55.658-.58l1.949-.413c.161-.351.518-.596.932-.596.568 0 1.029.461 1.029 1.029s-.461 1.029-1.029 1.029c-.568 0-1.029-.461-1.029-1.029l-1.749-.371-.535 2.515c1.271-.109 2.359-.479 3.148-1.078.236.145.511.229.804.229.843 0 1.524.682 1.524 1.524z"/>
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Reddit Analytics</h2>
                <p className="text-sm text-gray-400 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
                  COMMUNITY DISCUSSIONS
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
                {isRateLimitError ? 'Rate Limit Exceeded' : 'Unable to Load Reddit Data'}
              </h3>
              
              <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
                {error}
              </p>
              
              {!isConfigError && (
                <button
                  onClick={handleRetry}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
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

  const totalStats = getTotalStats();
  const topSubreddits = getTopSubreddits();

  return (
    <div className="relative group">
      {/* Enhanced background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-orange-600/20 via-red-600/20 to-pink-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-75"></div>
      <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 hover:border-orange-500/50 p-8 transition-all duration-300 shadow-2xl">
        {/* Subtle overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  {/* Reddit Logo SVG */}
                  <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.238 15.348c.085-.08.085-.221 0-.299-.888-.789-2.563-.789-3.451 0-.085.078-.085.219 0 .299.088.082.233.082.321 0 .662-.599 1.867-.599 2.529 0 .088.082.233.082.321 0zm-3.44-.984c0-.599-.485-1.084-1.084-1.084-.599 0-1.084.485-1.084 1.084 0 .599.485 1.084 1.084 1.084.599 0 1.084-.485 1.084-1.084zm5.448 0c0-.599-.485-1.084-1.084-1.084-.599 0-1.084.485-1.084 1.084 0 .599.485 1.084 1.084 1.084.599 0 1.084-.485 1.084-1.084zm-.321 4.235c-.78.78-2.048.78-2.829 0-.2-.2-.2-.524 0-.724.2-.2.524-.2.724 0 .384.384 1.581.384 1.965 0 .2-.2.524-.2.724 0 .2.2.2.524 0 .724zm5.058-6.234c0 .842-.681 1.524-1.524 1.524-.293 0-.568-.084-.804-.229-.789.599-1.876.969-3.148 1.078l.535-2.515 1.749.371c0 .568.461 1.029 1.029 1.029.568 0 1.029-.461 1.029-1.029s-.461-1.029-1.029-1.029c-.414 0-.771.245-.932.596l-1.949-.413c-.069-.015-.142-.002-.198.035-.057.037-.095.092-.108.155l-.592 2.788c-1.295-.109-2.408-.486-3.218-1.093-.236.146-.511.229-.804.229-.843 0-1.524-.681-1.524-1.524 0-.694.467-1.28 1.103-1.455.014-.189.033-.379.056-.568C2.775 8.924 4.204 6.229 7.26 4.669c.329-.168.73-.025.898.304.168.329.025.73-.304.898-2.616 1.334-3.803 3.548-3.461 5.694.026.168.048.337.065.507.605-.316 1.346-.516 2.147-.595l.535-2.515c.069-.325.328-.55.658-.58l1.949-.413c.161-.351.518-.596.932-.596.568 0 1.029.461 1.029 1.029s-.461 1.029-1.029 1.029c-.568 0-1.029-.461-1.029-1.029l-1.749-.371-.535 2.515c1.271-.109 2.359-.479 3.148-1.078.236.145.511.229.804.229.843 0 1.524.682 1.524 1.524z"/>
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Reddit Analytics</h2>
                <p className="text-sm text-gray-400 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
                  COMMUNITY DISCUSSIONS
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700/50">
              <Users className="h-4 w-4 text-orange-400" />
              <span className="font-mono">{posts.length} POSTS</span>
            </div>
          </div>

          {/* Total Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-orange-800/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                    <ArrowUp className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-orange-400 font-mono">TOTAL UPVOTES</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  {formatNumber(totalStats.upvotes)}
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-800/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-blue-400 font-mono">TOTAL COMMENTS</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  {formatNumber(totalStats.comments)}
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-800/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-purple-400 font-mono">AVG SCORE</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  {posts.length > 0 ? Math.round(totalStats.score / posts.length) : 0}
                </p>
              </div>
            </div>
          </div>

          {/* Top Subreddits */}
          {topSubreddits.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 font-mono">ACTIVE SUBREDDITS</h3>
              <div className="flex flex-wrap gap-3">
                {topSubreddits.map(([subreddit, count]) => (
                  <div key={subreddit} className="flex items-center gap-2 bg-gray-800/50 backdrop-blur px-4 py-2 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-all duration-200">
                    <div className="w-5 h-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                      <Users className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-orange-400">r/{subreddit}</span>
                    <span className="text-xs text-white bg-orange-500/20 px-2 py-1 rounded-full border border-orange-500/30 font-mono">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Posts */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white font-mono">HOT POSTS</h3>
              <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700/50">
                <MessageSquare className="h-4 w-4 text-orange-400" />
                <span className="font-mono">DISCUSSIONS</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {posts.slice(0, 6).map((post, index) => (
                <div key={`${post.id}-${index}`} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-red-600/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative bg-gray-800/50 backdrop-blur hover:bg-gray-800/70 rounded-xl p-5 border border-gray-700/50 hover:border-orange-500/30 transition-all duration-200">
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-orange-500/20 px-3 py-1 rounded-lg border border-orange-500/30">
                          <Users className="h-3 w-3 text-orange-400" />
                          <span className="text-xs font-medium text-orange-400 font-mono">r/{post.subreddit}</span>
                        </div>
                        <span className="text-xs text-gray-500 font-mono">u/{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(post.created_utc)}</span>
                      </div>
                    </div>
                    
                    {/* Post Title */}
                    <h4 className="font-bold text-white text-sm mb-4 leading-relaxed group-hover:text-orange-300 transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    
                    {/* Post Preview */}
                    {post.selftext && (
                      <p className="text-gray-400 text-xs mb-4 line-clamp-2">
                        {post.selftext.substring(0, 150)}...
                      </p>
                    )}
                    
                    {/* Post Metrics */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-xs">
                          <ArrowUp className="h-3 w-3 text-green-400" />
                          <span className="text-green-400 font-medium font-mono">{formatNumber(post.ups)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <MessageSquare className="h-3 w-3" />
                          <span className="font-mono">{formatNumber(post.num_comments)}</span>
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {formatNumber(post.score)}
                        </div>
                      </div>
                      
                      <a 
                        href={post.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 font-medium transition-colors"
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

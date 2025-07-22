'use client';

import { useState, useEffect } from 'react';
import { Newspaper, Calendar, ExternalLink, TrendingUp, Globe, AlertCircle, Clock } from 'lucide-react';
import { newsApi, NewsArticle } from '@/lib/api-services';

interface NewsFeedProps {
  artistName: string;
}

export default function NewsFeed({ artistName }: NewsFeedProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setError('');
        const newsData = await newsApi.searchNews(artistName);
        setArticles(newsData);
      } catch (error: any) {
        console.error('Error fetching news:', error);
        setError('Failed to fetch news. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (artistName) {
      fetchNews();
    }
  }, [artistName]);

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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getSourceColor = (sourceName: string) => {
    const colors = [
      'from-red-500 to-red-600',
      'from-blue-500 to-blue-600', 
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-orange-500 to-orange-600',
      'from-pink-500 to-pink-600'
    ];
    const index = sourceName.length % colors.length;
    return colors[index];
  };

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-24 h-20 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
            <Newspaper className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Latest News</h2>
            <p className="text-sm text-gray-600">Media coverage & industry updates</p>
          </div>
        </div>
        
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-gray-700 font-medium mb-2">Unable to load news</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

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
                  <Newspaper className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Latest News</h2>
                <p className="text-sm text-gray-400 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
                  MEDIA COVERAGE & UPDATES
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700/50">
              <Globe className="h-4 w-4 text-orange-400" />
              <span className="font-mono">{articles.length} articles found</span>
            </div>
          </div>

      {articles.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-800/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-700/50">
            <Newspaper className="h-8 w-8 text-orange-400" />
          </div>
          <p className="text-white font-medium mb-2">No recent news</p>
          <p className="text-sm text-gray-400">No recent articles found for {artistName}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.slice(0, 6).map((article, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-red-600/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/70 rounded-xl p-4 border border-gray-700/50 hover:border-orange-500/50 transition-all duration-200 shadow-lg">
                <div className="flex gap-4">
                  {article.urlToImage && (
                    <div className="flex-shrink-0">
                      <img 
                        src={article.urlToImage} 
                        alt={article.title}
                        className="w-24 h-20 object-cover rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-600/50"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-bold text-white text-sm line-clamp-2 group-hover:text-orange-400 transition-colors">
                        {article.title}
                      </h3>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg flex-shrink-0"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-3 line-clamp-2 leading-relaxed">
                      {truncateText(article.description || '', 120)}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 bg-gradient-to-r ${getSourceColor(article.source.name)} rounded-lg flex items-center justify-center`}>
                          <span className="text-xs font-bold text-white">
                            {article.source.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-semibold text-gray-300 text-sm">{article.source.name}</span>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">{formatDate(article.publishedAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-xs font-medium">Trending</span>
                      </div>
                    </div>
                  </div>
                </div>
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
import axios from 'axios';

// Types for API responses
export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: { name: string; images: Array<{ url: string }> };
  popularity: number;
  external_urls: { spotify: string };
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images: Array<{ url: string }>;
  followers: { total: number };
  popularity: number;
  genres: string[];
}

export interface TicketmasterEvent {
  id: string;
  name: string;
  url: string;
  images: Array<{ url: string; ratio: string }>;
  dates: {
    start: { localDate: string; localTime: string };
    status: { code: string };
  };
  priceRanges?: Array<{
    type: string;
    currency: string;
    min: number;
    max: number;
  }>;
  _embedded?: {
    venues: Array<{
      name: string;
      city: { name: string };
      state: { name: string };
    }>;
  };
}

export interface YouTubeVideo {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: { medium: { url: string } };
    publishedAt: string;
    channelTitle: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: { name: string };
}

export interface TwitterTweet {
  id: string;
  text: string;
  created_at: string;
  author: {
    id: string;
    name: string;
    username: string;
    profile_image_url: string;
    verified: boolean;
  };
  public_metrics: {
    retweet_count: number;
    like_count: number;
    reply_count: number;
    quote_count: number;
  };
}

export interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  url: string;
  permalink: string;
  subreddit: string;
  author: string;
  created_utc: number;
  score: number;
  ups: number;
  downs: number;
  num_comments: number;
  thumbnail: string | null;
  is_video: boolean;
  domain: string;
}

export interface LastFMArtist {
  mbid: string;
  name: string;
  url: string;
  image: Array<{ 
    '#text': string; 
    size: 'small' | 'medium' | 'large' | 'extralarge' | 'mega' 
  }>;
  streamable: string;
  stats: {
    listeners: string;
    playcount: string;
  };
  similar: {
    artist: Array<{
      name: string;
      url: string;
      image: Array<{ '#text': string; size: string }>;
    }>;
  };
  tags: {
    tag: Array<{
      name: string;
      url: string;
    }>;
  };
  bio: {
    links: {
      link: {
        '#text': string;
        rel: string;
        href: string;
      };
    };
    published: string;
    summary: string;
    content: string;
  };
}

export interface LastFMTopTrack {
  name: string;
  playcount: string;
  listeners: string;
  url: string;
  streamable: {
    '#text': string;
    fulltrack: string;
  };
  artist: {
    name: string;
    mbid: string;
    url: string;
  };
  image: Array<{
    '#text': string;
    size: string;
  }>;
  '@attr': {
    rank: string;
  };
}

export interface LastFMGeoData {
  name: string;
  listeners: string;
  mbid: string;
  url: string;
  streamable: string;
  image: Array<{
    '#text': string;
    size: string;
  }>;
}

// Google Trends types
export interface GoogleTrendsInterest {
  date: string;
  interest: number;
}

export interface GoogleTrendsRegional {
  country: string;
  interest: number;
}

export interface GoogleTrendsQuery {
  query: string;
  value: string | number;
}

export interface GoogleTrendsData {
  artist: string;
  interest_over_time: GoogleTrendsInterest[];
  regional_interest: GoogleTrendsRegional[];
  top_countries: GoogleTrendsRegional[];
  rising_queries: GoogleTrendsQuery[];
  top_queries: GoogleTrendsQuery[];
  peak_interest: number;
  average_interest: number;
  timeframe: string;
  status: string;
  service_available?: boolean;
  fallback?: boolean;
}

// Spotify API Services
export const spotifyApi = {
  async searchArtist(query: string): Promise<any> {
    try {
      const response = await axios.get('/api/spotify', {
        params: {
          q: query,
          type: 'artist'
        }
      });
      
      // Return the full response data which includes artist, albums, and topTracks
      return response.data;
    } catch (error) {
      console.error('Spotify artist search error:', error);
      return null;
    }
  },

  async getArtistSuggestions(query: string): Promise<any[]> {
    try {
      const response = await axios.get('/api/spotify', {
        params: { 
          q: query,
          suggestions: 'true'
        }
      });
      return response.data.artists || [];
    } catch (error) {
      console.error('Spotify suggestions error:', error);
      return [];
    }
  },

  async getArtistTopTracks(artistId: string): Promise<SpotifyTrack[]> {
    try {
      // This will be handled by the searchArtist endpoint now
      // For now, return empty array as tracks are included in the main response
      return [];
    } catch (error) {
      console.error('Spotify top tracks error:', error);
      return [];
    }
  },

  async getArtistStats(artistId: string): Promise<any> {
    try {
      // This will be handled by the searchArtist endpoint now
      // For now, return null as stats are included in the main response
      return null;
    } catch (error) {
      console.error('Spotify artist stats error:', error);
      return null;
    }
  }
};

// Ticketmaster API Services
export const ticketmasterApi = {
  async searchEvents(artistName: string): Promise<TicketmasterEvent[]> {
    try {
      const response = await axios.get('/api/ticketmaster', {
        params: {
          keyword: artistName,
          size: 20,
          sort: 'date,asc'
        }
      });
      return response.data._embedded?.events || [];
    } catch (error) {
      console.error('Ticketmaster events error:', error);
      return [];
    }
  },

  async getEventDetails(eventId: string): Promise<TicketmasterEvent | null> {
    try {
      // For now, we'll get event details from the search results
      // Could add a separate endpoint for this if needed
      return null;
    } catch (error) {
      console.error('Ticketmaster event details error:', error);
      return null;
    }
  }
};

// YouTube API Services
export const youtubeApi = {
  async searchVideos(query: string, maxResults: number = 10): Promise<YouTubeVideo[]> {
    try {
      const response = await axios.get('/api/youtube', {
        params: {
          q: query,
          maxResults
        }
      });
      
      return response.data.videos || [];
    } catch (error: any) {
      console.error('YouTube search error:', error);
      
      // If it's an HTTP error, try to get the error message from the response
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.details) {
        throw new Error(error.response.data.details);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to fetch YouTube data');
      }
    }
  },

  // Version for analytics service that doesn't throw on quota errors
  async searchVideosForAnalytics(query: string, maxResults: number = 10): Promise<YouTubeVideo[]> {
    try {
      const response = await axios.get('/api/youtube', {
        params: {
          q: query,
          maxResults
        }
      });
      
      return response.data.videos || [];
    } catch (error: any) {
      console.error('YouTube search error (analytics):', error);
      
      // For analytics service, return empty array on any error to prevent breaking the whole search
      return [];
    }
  },

  async getChannelStats(channelId: string): Promise<any> {
    try {
      // This would require a separate endpoint
      // For now, returning null
      return null;
    } catch (error) {
      console.error('YouTube channel stats error:', error);
      return null;
    }
  }
};

// News API Services
export const newsApi = {
  async searchNews(query: string): Promise<NewsArticle[]> {
    try {
      const response = await axios.get('/api/news', {
        params: {
          q: query
        }
      });
      return response.data.articles || [];
    } catch (error) {
      console.error('News API error:', error);
      return [];
    }
  },

  async getTopHeadlines(category: string = 'entertainment'): Promise<NewsArticle[]> {
    try {
      // This would require a separate endpoint
      // For now, using search with entertainment category
      const response = await axios.get('/api/news', {
        params: {
          q: 'music entertainment',
          category
        }
      });
      return response.data.articles || [];
    } catch (error) {
      console.error('News API top headlines error:', error);
      return [];
    }
  }
};

// Twitter API Services
export const twitterApi = {
  async searchTweets(query: string, maxResults: number = 10): Promise<TwitterTweet[]> {
    try {
      const response = await axios.get('/api/twitter', {
        params: {
          q: query,
          maxResults
        }
      });
      
      return response.data.tweets || [];
    } catch (error: any) {
      console.error('Twitter search error:', error);
      
      // If it's an HTTP error, try to get the error message from the response
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.details) {
        throw new Error(error.response.data.details);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to fetch Twitter data');
      }
    }
  },

  // Version for analytics service that doesn't throw on rate limit errors
  async searchTweetsForAnalytics(query: string, maxResults: number = 10): Promise<TwitterTweet[]> {
    try {
      const response = await axios.get('/api/twitter', {
        params: {
          q: query,
          maxResults
        }
      });
      
      return response.data.tweets || [];
    } catch (error: any) {
      console.error('Twitter search error (analytics):', error);
      
      // For analytics service, return empty array on any error to prevent breaking the whole search
      return [];
    }
  }
};

// Reddit API Services
export const redditApi = {
  async searchPosts(query: string, limit: number = 10): Promise<RedditPost[]> {
    try {
      const response = await axios.get('/api/reddit', {
        params: {
          q: query,
          limit
        }
      });
      
      return response.data.posts || [];
    } catch (error: any) {
      console.error('Reddit search error:', error);
      
      // If it's an HTTP error, try to get the error message from the response
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.details) {
        throw new Error(error.response.data.details);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to fetch Reddit data');
      }
    }
  },

  // Version for analytics service that doesn't throw on rate limit errors
  async searchPostsForAnalytics(query: string, limit: number = 10): Promise<RedditPost[]> {
    try {
      const response = await axios.get('/api/reddit', {
        params: {
          q: query,
          limit
        }
      });
      
      return response.data.posts || [];
    } catch (error: any) {
      console.error('Reddit search error (analytics):', error);
      
      // For analytics service, return empty array on any error to prevent breaking the whole search
      return [];
    }
  }
};

// Last.fm API Services
export const lastfmApi = {
  async getArtistInfo(artistName: string): Promise<LastFMArtist | null> {
    try {
      const response = await axios.get('/api/lastfm/artist', {
        params: {
          artist: artistName,
          method: 'artist.getinfo'
        },
        timeout: 8000
      });
      
      return response.data.artist || null;
    } catch (error: any) {
      console.warn('Last.fm artist info not available:', error.message || 'API timeout');
      return null;
    }
  },

  async getTopTracks(artistName: string, limit: number = 10): Promise<LastFMTopTrack[]> {
    try {
      const response = await axios.get('/api/lastfm/tracks', {
        params: {
          artist: artistName,
          method: 'artist.gettoptracks',
          limit
        },
        timeout: 8000
      });
      
      return response.data.toptracks?.track || [];
    } catch (error: any) {
      console.warn('Last.fm top tracks not available:', error.message || 'API timeout');
      return [];
    }
  },

  async getGeoTopArtists(country: string, limit: number = 50): Promise<any> {
    try {
      const response = await axios.get('/api/lastfm/geo', {
        params: {
          country: country,
          method: 'geo.gettopartists',
          limit
        },
        timeout: 8000
      });
      
      // Return the full response data, not just the artist array
      return response.data;
    } catch (error: any) {
      console.warn('Last.fm geo data not available:', error.message || 'API timeout');
      return {
        topartists: {
          artist: [],
          '@attr': {
            country: country,
            page: '1',
            perPage: limit,
            totalPages: '0',
            total: '0'
          }
        }
      };
    }
  },

  async getSimilarArtists(artistName: string, limit: number = 10): Promise<any[]> {
    try {
      const response = await axios.get('/api/lastfm/similar', {
        params: {
          artist: artistName,
          method: 'artist.getsimilar',
          limit
        },
        timeout: 8000
      });
      
      return response.data.similarartists?.artist || [];
    } catch (error: any) {
      console.warn('Last.fm similar artists not available:', error.message || 'API timeout');
      return [];
    }
  },

  async getTopAlbums(artistName: string, limit: number = 10): Promise<any[]> {
    try {
      const response = await axios.get('/api/lastfm/albums', {
        params: {
          artist: artistName,
          method: 'artist.gettopalbums',
          limit
        },
        timeout: 8000
      });
      
      return response.data.topalbums?.album || [];
    } catch (error: any) {
      console.warn('Last.fm top albums not available:', error.message || 'API timeout');
      return [];
    }
  },

  async getArtistTags(artistName: string, limit: number = 10): Promise<any[]> {
    try {
      const response = await axios.get('/api/lastfm/tags', {
        params: {
          artist: artistName,
          method: 'artist.gettoptags',
          limit
        },
        timeout: 8000
      });
      
      return response.data.toptags?.tag || [];
    } catch (error: any) {
      console.warn('Last.fm artist tags not available:', error.message || 'API timeout');
      return [];
    }
  },

  async getGlobalTopArtists(limit: number = 50, page: number = 1): Promise<any> {
    try {
      const response = await axios.get('/api/lastfm/charts', {
        params: {
          method: 'chart.gettopartists',
          limit,
          page
        },
        timeout: 8000
      });
      
      return response.data;
    } catch (error: any) {
      console.warn('Last.fm global top artists not available:', error.message || 'API timeout');
      return {
        artists: {
          artist: [],
          '@attr': {
            page: page.toString(),
            perPage: limit.toString(),
            totalPages: '0',
            total: '0'
          }
        }
      };
    }
  },

  async getGlobalTopTracks(limit: number = 50, page: number = 1): Promise<any> {
    try {
      const response = await axios.get('/api/lastfm/charts', {
        params: {
          method: 'chart.gettoptracks',
          limit,
          page
        },
        timeout: 8000
      });
      
      return response.data;
    } catch (error: any) {
      console.warn('Last.fm global top tracks not available:', error.message || 'API timeout');
      return {
        tracks: {
          track: [],
          '@attr': {
            page: page.toString(),
            perPage: limit.toString(),
            totalPages: '0',
            total: '0'
          }
        }
      };
    }
  }
};

// Google Trends API Services
export const googleTrendsApi = {
  async getArtistInterest(artistName: string): Promise<GoogleTrendsData | null> {
    try {
      const response = await axios.get('/api/google-trends', {
        params: {
          artist: artistName,
          type: 'interest'
        },
        timeout: 15000 // 15 second timeout
      });
      
      return response.data;
    } catch (error) {
      console.warn('Google Trends interest data unavailable:', error);
      return {
        artist: artistName,
        interest_over_time: [],
        regional_interest: [],
        top_countries: [],
        rising_queries: [],
        top_queries: [],
        peak_interest: 0,
        average_interest: 0,
        timeframe: '12 months',
        status: 'service_unavailable',
        service_available: false,
        fallback: true
      };
    }
  },

  async getRegionalInterest(artistName: string): Promise<any> {
    try {
      const response = await axios.get('/api/google-trends', {
        params: {
          artist: artistName,
          type: 'regional'
        },
        timeout: 15000
      });
      
      return response.data;
    } catch (error) {
      console.warn('Google Trends regional data unavailable:', error);
      return {
        artist: artistName,
        regional_interest: [],
        top_countries: [],
        status: 'service_unavailable',
        fallback: true
      };
    }
  },

  async getRelatedQueries(artistName: string): Promise<any> {
    try {
      const response = await axios.get('/api/google-trends', {
        params: {
          artist: artistName,
          type: 'related'
        },
        timeout: 15000
      });
      
      return response.data;
    } catch (error) {
      console.warn('Google Trends related queries unavailable:', error);
      return {
        artist: artistName,
        rising_queries: [],
        top_queries: [],
        status: 'service_unavailable',
        fallback: true
      };
    }
  },

  async getTrendingSearches(country: string = 'US'): Promise<any> {
    try {
      const response = await axios.get('/api/google-trends', {
        params: {
          type: 'trending',
          country: country
        },
        timeout: 15000
      });
      
      return response.data;
    } catch (error) {
      console.warn('Google Trends trending searches unavailable:', error);
      return {
        country: country,
        trending_searches: [],
        status: 'service_unavailable',
        fallback: true
      };
    }
  }
};

// Combined Analytics Service
export const analyticsService = {
  async getArtistAnalytics(artistName: string) {
    try {
      // Use Promise.allSettled to handle individual API failures gracefully
      const results = await Promise.allSettled([
        spotifyApi.searchArtist(artistName),
        ticketmasterApi.searchEvents(artistName),
        youtubeApi.searchVideosForAnalytics(artistName),
        newsApi.searchNews(artistName),
        twitterApi.searchTweetsForAnalytics(artistName),
        redditApi.searchPostsForAnalytics(artistName),
        lastfmApi.getArtistInfo(artistName),
        lastfmApi.getTopTracks(artistName),
        lastfmApi.getSimilarArtists(artistName),
        lastfmApi.getTopAlbums(artistName),
        lastfmApi.getArtistTags(artistName),
        googleTrendsApi.getArtistInterest(artistName),
        googleTrendsApi.getRegionalInterest(artistName),
        googleTrendsApi.getRelatedQueries(artistName)
      ]);

      // Extract results, using empty arrays/null for failed requests
      const spotifyData = results[0].status === 'fulfilled' ? results[0].value : null;
      const events = results[1].status === 'fulfilled' ? results[1].value : [];
      const videos = results[2].status === 'fulfilled' ? results[2].value : [];
      const news = results[3].status === 'fulfilled' ? results[3].value : [];
      const tweets = results[4].status === 'fulfilled' ? results[4].value : [];
      const redditPosts = results[5].status === 'fulfilled' ? results[5].value : [];
      const lastfmArtist = results[6].status === 'fulfilled' ? results[6].value : null;
      const lastfmTopTracks = results[7].status === 'fulfilled' ? results[7].value : [];
      const lastfmSimilar = results[8].status === 'fulfilled' ? results[8].value : [];
      const lastfmTopAlbums = results[9].status === 'fulfilled' ? results[9].value : [];
      const lastfmTags = results[10].status === 'fulfilled' ? results[10].value : [];
      const googleTrendsInterest = results[11].status === 'fulfilled' ? results[11].value : null;
      const googleTrendsRegional = results[12].status === 'fulfilled' ? results[12].value : null;
      const googleTrendsRelated = results[13].status === 'fulfilled' ? results[13].value : null;

      // Log any failures for debugging
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const apiNames = ['Spotify', 'Ticketmaster', 'YouTube', 'News', 'Twitter', 'Reddit', 'Last.fm Artist', 'Last.fm Tracks', 'Last.fm Similar', 'Last.fm Albums', 'Last.fm Tags', 'Google Trends Interest', 'Google Trends Regional', 'Google Trends Related'];
          console.warn(`${apiNames[index]} API failed:`, result.reason);
        }
      });

      return {
        spotify: spotifyData,
        events: events,
        videos: videos,
        news: news,
        tweets: tweets,
        redditPosts: redditPosts,
        lastfm: {
          artist: lastfmArtist,
          topTracks: lastfmTopTracks,
          similarArtists: lastfmSimilar,
          topAlbums: lastfmTopAlbums,
          tags: lastfmTags
        },
        googleTrends: {
          interest: googleTrendsInterest,
          regional: googleTrendsRegional,
          related: googleTrendsRelated
        }
      };
    } catch (error) {
      console.error('Analytics service error:', error);
      return null;
    }
  }
};
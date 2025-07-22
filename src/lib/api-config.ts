// API Configuration for ArtistPulse
export const API_CONFIG = {
  ticketmaster: {
    consumerKey: 'tK5cIj8zTEn6p5zZ16kMyPyzUO44gwA5',
    consumerSecret: 'pDBp4yANPZFXyODs',
    baseUrl: 'https://app.ticketmaster.com/discovery/v2'
  },
  spotify: {
    clientId: '7d265994bd6543a9bd866fde8d5cc094',
    clientSecret: '693aa96325484b968a191774a666f72f',
    baseUrl: 'https://api.spotify.com/v1'
  },
  youtube: {
    apiKey: 'AIzaSyAlNqYv1AlVhkigr-ldEzUVOU-S-qkNxFc',
    baseUrl: 'https://www.googleapis.com/youtube/v3'
  },
  newsapi: {
    apiKey: 'dc15ce6075fa4709a03e1890b1e67f08',
    baseUrl: 'https://newsapi.org/v2'
  },
  twitter: {
    apiKey: '8wSCDaFfmmTH6oYLMDJ7J2hTv',
    apiKeySecret: 'zf5UkH6uS2OgQk1XEaAenc2zFgqGvbwLDwCTtKzxePPA35HMin',
    baseUrl: 'https://api.twitter.com/2'
  },
  reddit: {
    clientId: 'LYjGxZye9Z2t6YUOxPEFZQ',
    clientSecret: '_gXNYqyZtka9I-yQMkJZ3Xp1X-GkUw',
    baseUrl: 'https://oauth.reddit.com'
  },
  lastfm: {
    apiKey: 'a2a170deeb59d92b91b550d6016c020f',
    sharedSecret: '7db66062a7b3b01af0d1b9e061a50ff6',
    baseUrl: 'http://ws.audioscrobbler.com/2.0'
  },
  musicbrainz: {
    baseUrl: 'https://musicbrainz.org/ws/2',
    coverArtUrl: 'https://coverartarchive.org',
    userAgent: 'ArtistPulse/0.1.0 ( https://github.com/kritinkaul/artistpulse )',
    rateLimit: 1000 // 1 request per second as per MusicBrainz guidelines
  }
};

// Environment variables (for production, these should be in .env.local)
export const getApiKey = (platform: keyof typeof API_CONFIG) => {
  return API_CONFIG[platform];
};
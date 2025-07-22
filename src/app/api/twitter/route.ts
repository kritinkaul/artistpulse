import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const maxResults = searchParams.get('maxResults') || '10';

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  // Check if API keys are configured
  if (!API_CONFIG.twitter.apiKey || !API_CONFIG.twitter.apiKeySecret) {
    console.error('Twitter API keys are not configured');
    return NextResponse.json(
      { error: 'Twitter API keys not configured' },
      { status: 500 }
    );
  }

  try {
    // For Twitter API v2, we need to get a bearer token first
    const bearerTokenResponse = await fetch('https://api.twitter.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${API_CONFIG.twitter.apiKey}:${API_CONFIG.twitter.apiKeySecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: 'grant_type=client_credentials'
    });

    if (!bearerTokenResponse.ok) {
      const errorText = await bearerTokenResponse.text();
      console.error('Twitter Bearer Token Error:', errorText);
      return NextResponse.json(
        { error: 'Failed to authenticate with Twitter API' },
        { status: 401 }
      );
    }

    const bearerTokenData = await bearerTokenResponse.json();
    const bearerToken = bearerTokenData.access_token;

    // Search for tweets about the artist
    const searchUrl = `${API_CONFIG.twitter.baseUrl}/tweets/search/recent?query=${encodeURIComponent(`"${query}" OR "${query.replace(/\s+/g, '')}"`)}&max_results=${Math.min(parseInt(maxResults), 10)}&tweet.fields=created_at,author_id,public_metrics&user.fields=name,username,profile_image_url,verified&expansions=author_id`;
    
    console.log('Twitter API request for query:', query);

    const searchResponse = await fetch(searchUrl, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      }
    });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }

      console.error('Twitter Search API error:', {
        status: searchResponse.status,
        statusText: searchResponse.statusText,
        error: errorData
      });

      // Handle specific Twitter API errors
      if (searchResponse.status === 429) {
        console.log('Twitter API rate limit exceeded, returning mock data');
        
        // Return mock Twitter data when rate limited
        return NextResponse.json({
          data: [
            {
              id: '1',
              text: `Great music from ${query}! Can't wait for the next album 🎵`,
              created_at: new Date().toISOString(),
              author_id: 'user1',
              public_metrics: {
                retweet_count: 42,
                like_count: 156,
                reply_count: 23,
                quote_count: 8
              }
            },
            {
              id: '2',
              text: `Just discovered ${query} and I'm obsessed! 🔥`,
              created_at: new Date(Date.now() - 3600000).toISOString(),
              author_id: 'user2',
              public_metrics: {
                retweet_count: 18,
                like_count: 89,
                reply_count: 12,
                quote_count: 3
              }
            }
          ],
          includes: {
            users: [
              {
                id: 'user1',
                name: 'Music Lover',
                username: 'musicfan1',
                profile_image_url: 'https://via.placeholder.com/48',
                verified: false
              },
              {
                id: 'user2',
                name: 'Pop Culture',
                username: 'popculture',
                profile_image_url: 'https://via.placeholder.com/48',
                verified: false
              }
            ]
          },
          meta: {
            result_count: 2
          }
        });
      } else if (searchResponse.status === 401) {
        return NextResponse.json(
          { error: 'Twitter API authentication failed' },
          { status: 401 }
        );
      }

      throw new Error(`Twitter API error: ${searchResponse.status} - ${errorData.detail || errorData.message || errorText}`);
    }

    const searchData = await searchResponse.json();
    console.log('Twitter search response:', {
      totalResults: searchData.meta?.result_count || 0,
      tweetsReturned: searchData.data?.length || 0
    });

    // Format the response
    const tweets = (searchData.data || []).map((tweet: any) => {
      const author = searchData.includes?.users?.find((user: any) => user.id === tweet.author_id);
      return {
        id: tweet.id,
        text: tweet.text,
        created_at: tweet.created_at,
        author: {
          id: tweet.author_id,
          name: author?.name || 'Unknown',
          username: author?.username || 'unknown',
          profile_image_url: author?.profile_image_url || '',
          verified: author?.verified || false
        },
        public_metrics: tweet.public_metrics || {
          retweet_count: 0,
          like_count: 0,
          reply_count: 0,
          quote_count: 0
        }
      };
    });

    return NextResponse.json({ 
      tweets,
      meta: searchData.meta || {}
    });

  } catch (error) {
    console.error('Twitter API error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      query: query
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch Twitter data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

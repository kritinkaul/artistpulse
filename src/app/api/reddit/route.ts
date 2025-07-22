import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const limit = searchParams.get('limit') || '10';

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  // Check if API credentials are configured
  if (!API_CONFIG.reddit.clientId || !API_CONFIG.reddit.clientSecret) {
    console.error('Reddit API credentials are not configured');
    return NextResponse.json(
      { error: 'Reddit API credentials not configured' },
      { status: 500 }
    );
  }

  try {
    // Get Reddit OAuth token
    const authResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${API_CONFIG.reddit.clientId}:${API_CONFIG.reddit.clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'ArtistPulse/1.0'
      },
      body: 'grant_type=client_credentials'
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error('Reddit Auth Error:', errorText);
      return NextResponse.json(
        { error: 'Failed to authenticate with Reddit API' },
        { status: 401 }
      );
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    // Search for posts about the artist
    const searchUrl = `${API_CONFIG.reddit.baseUrl}/search.json?q=${encodeURIComponent(query)}&limit=${limit}&sort=hot&type=link`;
    
    console.log('Reddit API request for query:', query);

    const searchResponse = await fetch(searchUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'ArtistPulse/1.0'
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

      console.error('Reddit Search API error:', {
        status: searchResponse.status,
        statusText: searchResponse.statusText,
        error: errorData
      });

      // Handle specific Reddit API errors
      if (searchResponse.status === 429) {
        return NextResponse.json(
          { error: 'Reddit API rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      } else if (searchResponse.status === 401) {
        return NextResponse.json(
          { error: 'Reddit API authentication failed' },
          { status: 401 }
        );
      }

      throw new Error(`Reddit API error: ${searchResponse.status} - ${errorData.message || errorText}`);
    }

    const searchData = await searchResponse.json();
    console.log('Reddit search response:', {
      totalResults: searchData.data?.children?.length || 0
    });

    // Format the response
    const posts = (searchData.data?.children || []).map((post: any) => {
      const data = post.data;
      return {
        id: data.id,
        title: data.title,
        selftext: data.selftext,
        url: data.url,
        permalink: `https://reddit.com${data.permalink}`,
        subreddit: data.subreddit,
        author: data.author,
        created_utc: data.created_utc,
        score: data.score,
        ups: data.ups,
        downs: data.downs,
        num_comments: data.num_comments,
        thumbnail: data.thumbnail !== 'self' && data.thumbnail !== 'default' ? data.thumbnail : null,
        is_video: data.is_video || false,
        domain: data.domain
      };
    });

    return NextResponse.json({ 
      posts,
      meta: {
        total_results: searchData.data?.children?.length || 0
      }
    });

  } catch (error) {
    console.error('Reddit API error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      query: query
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch Reddit data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

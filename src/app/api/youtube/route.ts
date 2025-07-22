import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const maxResults = searchParams.get('maxResults') || '10';

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  // Check if API key is configured
  if (!API_CONFIG.youtube.apiKey) {
    console.error('YouTube API key is not configured');
    return NextResponse.json(
      { error: 'YouTube API key not configured' },
      { status: 500 }
    );
  }

  try {
    const searchUrl = `${API_CONFIG.youtube.baseUrl}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${API_CONFIG.youtube.apiKey}&order=relevance`;
    console.log('YouTube API request URL:', searchUrl.replace(API_CONFIG.youtube.apiKey, 'REDACTED'));

    // Search for videos
    const searchResponse = await fetch(searchUrl);

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }

      console.error(`YouTube Search API error:`, {
        status: searchResponse.status,
        statusText: searchResponse.statusText,
        error: errorData
      });

      // Handle specific YouTube API errors
      if (searchResponse.status === 403) {
        if (errorData.error?.errors?.[0]?.reason === 'quotaExceeded') {
          return NextResponse.json(
            { error: 'YouTube API quota exceeded. Please try again later.' },
            { status: 503 }
          );
        } else if (errorData.error?.errors?.[0]?.reason === 'keyInvalid') {
          return NextResponse.json(
            { error: 'YouTube API key is invalid' },
            { status: 500 }
          );
        }
      }

      throw new Error(`YouTube API error: ${searchResponse.status} - ${errorData.error?.message || errorText}`);
    }

    const searchData = await searchResponse.json();
    console.log('YouTube search response:', {
      totalResults: searchData.pageInfo?.totalResults || 0,
      itemsReturned: searchData.items?.length || 0
    });
    
    if (searchData.items && searchData.items.length > 0) {
      // Get video statistics for each video
      const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
      
      const statsUrl = `${API_CONFIG.youtube.baseUrl}/videos?part=statistics&id=${videoIds}&key=${API_CONFIG.youtube.apiKey}`;
      console.log('YouTube stats request for video IDs:', videoIds);

      const statsResponse = await fetch(statsUrl);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        console.log('YouTube stats response:', {
          itemsReturned: statsData.items?.length || 0
        });
        
        // Combine search results with statistics
        const videos = searchData.items.map((item: any, index: number) => ({
          id: item.id.videoId,
          snippet: item.snippet,
          statistics: statsData.items[index]?.statistics || {}
        }));

        return NextResponse.json({ videos });
      } else {
        const statsErrorText = await statsResponse.text();
        let statsErrorData;
        try {
          statsErrorData = JSON.parse(statsErrorText);
        } catch {
          statsErrorData = { message: statsErrorText };
        }

        console.error(`YouTube Statistics API error:`, {
          status: statsResponse.status,
          statusText: statsResponse.statusText,
          error: statsErrorData
        });

        // Return videos without statistics if stats API fails
        const videos = searchData.items.map((item: any) => ({
          id: item.id.videoId,
          snippet: item.snippet,
          statistics: {}
        }));
        return NextResponse.json({ videos });
      }
    }

    console.log('No videos found for query:', query);
    return NextResponse.json({ videos: searchData.items || [] });
  } catch (error) {
    console.error('YouTube API error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      query: query
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch YouTube data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 
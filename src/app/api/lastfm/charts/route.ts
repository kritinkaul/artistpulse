import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const method = searchParams.get('method') || 'chart.gettopartists';
  const limit = searchParams.get('limit') || '50';
  const page = searchParams.get('page') || '1';

  try {
    const baseUrl = API_CONFIG.lastfm.baseUrl;
    const apiKey = API_CONFIG.lastfm.apiKey;
    
    const url = `${baseUrl}?method=${method}&api_key=${apiKey}&format=json&limit=${limit}&page=${page}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ArtistPulse/1.0'
      },
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      console.error(`Last.fm charts API HTTP error: ${response.status} ${response.statusText}`);
      
      // Return mock data instead of failing
      const mockResponse = method.includes('tracks') ? {
        tracks: {
          track: [],
          '@attr': {
            page: page,
            perPage: limit,
            totalPages: '0',
            total: '0'
          }
        }
      } : {
        artists: {
          artist: [],
          '@attr': {
            page: page,
            perPage: limit,
            totalPages: '0',
            total: '0'
          }
        }
      };
      
      return NextResponse.json(mockResponse);
    }

    const data = await response.json();
    
    if (data.error) {
      console.error('Last.fm charts API error:', data.message);
      
      const mockResponse = method.includes('tracks') ? {
        tracks: {
          track: [],
          '@attr': {
            page: page,
            perPage: limit,
            totalPages: '0',
            total: '0'
          }
        }
      } : {
        artists: {
          artist: [],
          '@attr': {
            page: page,
            perPage: limit,
            totalPages: '0',
            total: '0'
          }
        }
      };
      
      return NextResponse.json(mockResponse);
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Last.fm charts API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Last.fm charts data', details: error.message },
      { status: 500 }
    );
  }
}

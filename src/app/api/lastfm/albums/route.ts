import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get('artist');
  const method = searchParams.get('method') || 'artist.gettopalbums';
  const limit = searchParams.get('limit') || '10';

  if (!artist) {
    return NextResponse.json({ error: 'Artist name is required' }, { status: 400 });
  }

  try {
    const baseUrl = API_CONFIG.lastfm.baseUrl;
    const apiKey = API_CONFIG.lastfm.apiKey;
    
    const url = `${baseUrl}?method=${method}&artist=${encodeURIComponent(artist)}&api_key=${apiKey}&format=json&limit=${limit}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ArtistPulse/1.0'
      },
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      console.error(`Last.fm albums API HTTP error: ${response.status} ${response.statusText}`);
      
      // Return mock data instead of failing
      return NextResponse.json({
        topalbums: {
          album: [],
          '@attr': {
            artist: artist,
            page: '1',
            perPage: limit,
            totalPages: '0',
            total: '0'
          }
        }
      });
    }

    const data = await response.json();
    
    if (data.error) {
      console.error('Last.fm albums API error:', data.message);
      return NextResponse.json({
        topalbums: {
          album: [],
          '@attr': {
            artist: artist,
            page: '1',
            perPage: limit,
            totalPages: '0',
            total: '0'
          }
        }
      });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Last.fm albums API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Last.fm albums data', details: error.message },
      { status: 500 }
    );
  }
}

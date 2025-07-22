import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get('artist');
  const method = searchParams.get('method') || 'artist.gettoptracks';
  const limit = searchParams.get('limit') || '10';

  if (!artist) {
    return NextResponse.json({ error: 'Artist name is required' }, { status: 400 });
  }

  try {
    const baseUrl = API_CONFIG.lastfm.baseUrl;
    const apiKey = API_CONFIG.lastfm.apiKey;
    
    const url = `${baseUrl}?method=${method}&artist=${encodeURIComponent(artist)}&api_key=${apiKey}&format=json&limit=${limit}`;
    
    console.log('Last.fm tracks API URL:', url.replace(apiKey, 'REDACTED'));
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ArtistPulse/1.0'
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!response.ok) {
      console.error(`Last.fm tracks API HTTP error: ${response.status} ${response.statusText}`);
      
      // Return mock data instead of failing
      return NextResponse.json({
        toptracks: {
          track: [],
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
      console.error('Last.fm tracks API error:', data.message);
      
      // Return mock data instead of failing
      return NextResponse.json({
        toptracks: {
          track: [],
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
    console.error('Last.fm tracks API error:', error.message);
    
    // Return mock data instead of failing completely
    return NextResponse.json({
      toptracks: {
        track: [],
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
}

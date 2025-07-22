import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get('artist');
  const method = searchParams.get('method');

  if (!artist || !method) {
    return NextResponse.json({ error: 'Artist name and method are required' }, { status: 400 });
  }

  try {
    const baseUrl = API_CONFIG.lastfm.baseUrl;
    const apiKey = API_CONFIG.lastfm.apiKey;
    
    const url = `${baseUrl}/?method=${method}&artist=${encodeURIComponent(artist)}&api_key=${apiKey}&format=json`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ArtistPulse/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Last.fm API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.message || 'Last.fm API error');
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Last.fm artist API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Last.fm artist data', details: error.message },
      { status: 500 }
    );
  }
}

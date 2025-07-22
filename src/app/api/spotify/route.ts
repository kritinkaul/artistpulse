import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const type = searchParams.get('type') || 'artist';
  const suggestions = searchParams.get('suggestions') === 'true';

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    // Get Spotify access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${API_CONFIG.spotify.clientId}:${API_CONFIG.spotify.clientSecret}`)}`
      },
      body: 'grant_type=client_credentials'
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get Spotify access token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // If requesting suggestions, return multiple artists for dropdown
    if (suggestions) {
      const searchResponse = await fetch(
        `${API_CONFIG.spotify.baseUrl}/search?q=${encodeURIComponent(query)}&type=artist&limit=10`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!searchResponse.ok) {
        throw new Error('Failed to search Spotify');
      }

      const searchData = await searchResponse.json();
      
      return NextResponse.json({
        artists: searchData.artists?.items?.map((artist: any) => ({
          id: artist.id,
          name: artist.name,
          image: artist.images?.[0]?.url,
          followers: artist.followers?.total
        })) || []
      });
    }

    // Search for artist
    const searchResponse = await fetch(
      `${API_CONFIG.spotify.baseUrl}/search?q=${encodeURIComponent(query)}&type=${type}&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!searchResponse.ok) {
      throw new Error('Failed to search Spotify');
    }

    const searchData = await searchResponse.json();
    
    if (type === 'artist' && searchData.artists?.items?.length > 0) {
      const artist = searchData.artists.items[0];
      
      // Get additional artist data
      const [artistResponse, albumsResponse, topTracksResponse] = await Promise.all([
        fetch(`${API_CONFIG.spotify.baseUrl}/artists/${artist.id}`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }),
        fetch(`${API_CONFIG.spotify.baseUrl}/artists/${artist.id}/albums?limit=50`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }),
        fetch(`${API_CONFIG.spotify.baseUrl}/artists/${artist.id}/top-tracks?market=US`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        })
      ]);

      const [artistData, albumsData, topTracksData] = await Promise.all([
        artistResponse.json(),
        albumsResponse.json(),
        topTracksResponse.json()
      ]);

      return NextResponse.json({
        artist: artistData,
        albums: albumsData.items,
        topTracks: topTracksData.tracks
      });
    }

    return NextResponse.json(searchData);
  } catch (error) {
    console.error('Spotify API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Spotify data' },
      { status: 500 }
    );
  }
} 
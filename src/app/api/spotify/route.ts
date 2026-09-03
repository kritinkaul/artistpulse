import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';
import { searchArtistsFallback, toSpotifyLikeArtist } from '@/lib/artist-search-fallback';

let cachedToken: { value: string; expiresAt: number } | null = null;
let spotifyDisabledUntil = 0;

async function getSpotifyAccessToken(): Promise<string | null> {
  if (Date.now() < spotifyDisabledUntil) {
    return null;
  }

  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${API_CONFIG.spotify.clientId}:${API_CONFIG.spotify.clientSecret}`).toString('base64')}`
    },
    body: 'grant_type=client_credentials'
  });

  if (!tokenResponse.ok) {
    const details = await tokenResponse.text();
    console.error('Spotify token error:', tokenResponse.status, details);
    if (tokenResponse.status === 403 || tokenResponse.status === 401) {
      spotifyDisabledUntil = Date.now() + 60 * 60 * 1000;
    }
    return null;
  }

  const tokenData = await tokenResponse.json();
  cachedToken = {
    value: tokenData.access_token,
    expiresAt: Date.now() + ((tokenData.expires_in || 3600) - 60) * 1000,
  };
  return cachedToken.value;
}

async function spotifySearch(accessToken: string, query: string, limit: number) {
  const searchResponse = await fetch(
    `${API_CONFIG.spotify.baseUrl}/search?q=${encodeURIComponent(query)}&type=artist&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );

  if (!searchResponse.ok) {
    const details = await searchResponse.text();
    console.error('Spotify search error:', searchResponse.status, details);
    if (searchResponse.status === 403 || searchResponse.status === 401) {
      spotifyDisabledUntil = Date.now() + 60 * 60 * 1000;
      cachedToken = null;
    }
    return null;
  }

  return searchResponse.json();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const type = searchParams.get('type') || 'artist';
  const suggestions = searchParams.get('suggestions') === 'true';

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const accessToken = await getSpotifyAccessToken();
    const searchData = accessToken ? await spotifySearch(accessToken, query, suggestions ? 10 : 1) : null;

    if (suggestions) {
      const spotifyArtists = searchData?.artists?.items?.map((artist: any) => ({
        id: artist.id,
        name: artist.name,
        image: artist.images?.[0]?.url,
        followers: artist.followers?.total
      })) || [];

      if (spotifyArtists.length > 0) {
        return NextResponse.json({ artists: spotifyArtists, source: 'spotify' });
      }

      const fallbackArtists = await searchArtistsFallback(query);
      return NextResponse.json({
        artists: fallbackArtists,
        source: 'fallback'
      });
    }

    if (type === 'artist' && searchData?.artists?.items?.length > 0 && accessToken) {
      const artist = searchData.artists.items[0];

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

      if (artistData?.id || artistData?.name) {
        return NextResponse.json({
          artist: artistData,
          albums: albumsData.items || [],
          topTracks: topTracksData.tracks || [],
          source: 'spotify'
        });
      }
    }

    const fallbackArtists = await searchArtistsFallback(query);
    if (fallbackArtists[0]) {
      return NextResponse.json({
        artist: toSpotifyLikeArtist(fallbackArtists[0]),
        albums: [],
        topTracks: [],
        source: 'fallback'
      });
    }

    return NextResponse.json({ artists: { items: [] }, source: 'none' });
  } catch (error) {
    console.error('Spotify API error:', error);

    try {
      const fallbackArtists = await searchArtistsFallback(query);
      if (suggestions) {
        return NextResponse.json({ artists: fallbackArtists, source: 'fallback' });
      }
      if (fallbackArtists[0]) {
        return NextResponse.json({
          artist: toSpotifyLikeArtist(fallbackArtists[0]),
          albums: [],
          topTracks: [],
          source: 'fallback'
        });
      }
    } catch (fallbackError) {
      console.error('Artist search fallback error:', fallbackError);
    }

    return NextResponse.json(
      { error: 'Failed to fetch artist data' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';

// Rate limiting - simple in-memory store (in production, use Redis)
let lastRequestTime = 0;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function rateLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < API_CONFIG.musicbrainz.rateLimit) {
    const waitTime = API_CONFIG.musicbrainz.rateLimit - timeSinceLastRequest;
    await delay(waitTime);
  }
  
  lastRequestTime = Date.now();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const artistName = searchParams.get('artist');

    if (!artistName) {
      return NextResponse.json(
        { error: 'Artist name is required' },
        { status: 400 }
      );
    }

    // Rate limit requests to comply with MusicBrainz guidelines
    await rateLimit();

    // Search for artist
    const searchUrl = `${API_CONFIG.musicbrainz.baseUrl}/artist?query=artist:${encodeURIComponent(artistName)}&fmt=json&limit=1`;
    
    console.log('MusicBrainz search URL:', searchUrl);

    const searchResponse = await fetch(searchUrl, {
      headers: {
        'User-Agent': API_CONFIG.musicbrainz.userAgent,
        'Accept': 'application/json'
      }
    });

    if (!searchResponse.ok) {
      throw new Error(`MusicBrainz search failed: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();

    if (!searchData.artists || searchData.artists.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Artist not found in MusicBrainz'
      });
    }

    const artist = searchData.artists[0];
    
    // Get detailed artist information
    await rateLimit(); // Rate limit for second request
    
    const detailUrl = `${API_CONFIG.musicbrainz.baseUrl}/artist/${artist.id}?inc=genres+tags+url-rels+annotation&fmt=json`;
    
    const detailResponse = await fetch(detailUrl, {
      headers: {
        'User-Agent': API_CONFIG.musicbrainz.userAgent,
        'Accept': 'application/json'
      }
    });

    if (!detailResponse.ok) {
      throw new Error(`MusicBrainz detail fetch failed: ${detailResponse.status}`);
    }

    const detailData = await detailResponse.json();

    // Try to get cover art
    let imageUrl = '';
    try {
      await rateLimit(); // Rate limit for cover art request
      
      const coverArtUrl = `${API_CONFIG.musicbrainz.coverArtUrl}/artist/${artist.id}`;
      const coverResponse = await fetch(coverArtUrl, {
        headers: {
          'User-Agent': API_CONFIG.musicbrainz.userAgent,
          'Accept': 'application/json'
        }
      });

      if (coverResponse.ok) {
        const coverData = await coverResponse.json();
        if (coverData.images && coverData.images.length > 0) {
          // Get the front cover or first available image
          const frontCover = coverData.images.find((img: any) => img.front) || coverData.images[0];
          imageUrl = frontCover.image;
        }
      }
    } catch (coverError) {
      console.log('Cover art not available:', coverError);
      // Continue without cover art
    }

    // Process the data
    const processedData = {
      id: detailData.id,
      name: detailData.name,
      sortName: detailData['sort-name'],
      type: detailData.type,
      gender: detailData.gender,
      country: detailData.country,
      lifeSpan: detailData['life-span'],
      beginArea: detailData['begin-area'],
      area: detailData.area,
      genres: detailData.genres?.map((g: any) => g.name) || [],
      tags: detailData.tags?.map((t: any) => t.name) || [],
      image: imageUrl,
      annotation: detailData.annotation,
      relations: detailData.relations?.filter((rel: any) => 
        rel.type === 'official homepage' || 
        rel.type === 'social network'
      ) || [],
      disambiguation: detailData.disambiguation,
      score: artist.score
    };

    return NextResponse.json({
      success: true,
      artist: processedData,
      source: 'MusicBrainz'
    });

  } catch (error: any) {
    console.error('MusicBrainz API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch artist data from MusicBrainz',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

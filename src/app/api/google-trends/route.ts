import { NextRequest, NextResponse } from 'next/server';

const TRENDS_SERVICE_URL = 'http://localhost:5001';

// Helper function to check if trends service is available
async function isTrendsServiceAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${TRENDS_SERVICE_URL}/health`, { 
      signal: AbortSignal.timeout(2000) // 2 second timeout
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Helper function to fetch from trends service with fallback
async function fetchFromTrendsService(endpoint: string): Promise<any> {
  try {
    const response = await fetch(`${TRENDS_SERVICE_URL}${endpoint}`, {
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`Trends service responded with ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.warn('Google Trends service unavailable:', error);
    return {
      status: 'service_unavailable',
      message: 'Google Trends data temporarily unavailable',
      fallback: true
    };
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get('artist');
  const type = searchParams.get('type') || 'interest';

  if (!artist) {
    return NextResponse.json(
      { error: 'Artist parameter is required' },
      { status: 400 }
    );
  }

  // Check if trends service is available
  const serviceAvailable = await isTrendsServiceAvailable();
  
  if (!serviceAvailable) {
    // Return fallback data when service is unavailable
    return NextResponse.json({
      artist,
      status: 'service_unavailable',
      message: 'Google Trends service is currently unavailable',
      fallback_data: {
        interest_over_time: [],
        regional_interest: [],
        top_countries: [],
        rising_queries: [],
        top_queries: [],
        trending_searches: []
      }
    });
  }

  try {
    let endpoint = '';
    
    switch (type) {
      case 'interest':
        endpoint = `/trends/interest?artist=${encodeURIComponent(artist)}`;
        break;
      case 'regional':
        endpoint = `/trends/regional?artist=${encodeURIComponent(artist)}`;
        break;
      case 'related':
        endpoint = `/trends/related?artist=${encodeURIComponent(artist)}`;
        break;
      case 'trending':
        const country = searchParams.get('country') || 'US';
        endpoint = `/trends/trending?country=${country}`;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid type parameter. Use: interest, regional, related, or trending' },
          { status: 400 }
        );
    }

    const data = await fetchFromTrendsService(endpoint);
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error fetching trends data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch trends data',
        status: 'error',
        fallback: true
      },
      { status: 500 }
    );
  }
}

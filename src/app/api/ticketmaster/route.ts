import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');
  const size = searchParams.get('size') || '20';
  const sort = searchParams.get('sort') || 'date,asc';

  if (!keyword) {
    return NextResponse.json({ error: 'Keyword parameter is required' }, { status: 400 });
  }

  try {
    // Use the correct API key parameter for Ticketmaster Discovery API
    const url = new URL('https://app.ticketmaster.com/discovery/v2/events.json');
    url.searchParams.set('apikey', API_CONFIG.ticketmaster.consumerKey);
    url.searchParams.set('keyword', keyword);
    url.searchParams.set('size', size);
    url.searchParams.set('sort', sort);
    url.searchParams.set('countryCode', 'US');
    url.searchParams.set('classificationName', 'music'); // Filter for music events only

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ArtistPulse/1.0'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ticketmaster API error details:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url: url.toString()
      });
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Invalid Ticketmaster credentials. Please check your API key configuration.' },
          { status: 401 }
        );
      }
      
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      
      throw new Error(`Ticketmaster API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Filter events to ensure they're actually related to the artist
    if (data._embedded?.events) {
      const filteredEvents = data._embedded.events.filter((event: any) => {
        const eventName = event.name?.toLowerCase() || '';
        const keywordLower = keyword.toLowerCase();
        
        // Check if the artist name appears in the event name
        return eventName.includes(keywordLower);
      });
      
      return NextResponse.json({
        ...data,
        _embedded: {
          ...data._embedded,
          events: filteredEvents
        },
        page: {
          ...data.page,
          totalElements: filteredEvents.length
        }
      });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Ticketmaster API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Ticketmaster data' },
      { status: 500 }
    );
  }
} 
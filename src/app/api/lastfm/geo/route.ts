import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country');
  const artist = searchParams.get('artist');
  const method = searchParams.get('method') || 'geo.gettopartists';
  const limit = searchParams.get('limit') || '50';

  // If artist is provided, return top cities for that artist
  if (artist) {
    const artistLower = artist.toLowerCase();
    let mockTopCities;

    // Indian/Bollywood artists - Focus on major Indian metros and diaspora
    if (artistLower.includes('arijit') || artistLower.includes('shreya') || artistLower.includes('kumar sanu') || 
        artistLower.includes('lata mangeshkar') || artistLower.includes('kishore kumar') || artistLower.includes('sonu nigam') ||
        artistLower.includes('armaan malik') || artistLower.includes('rahat fateh') || artistLower.includes('mohit chauhan') ||
        artistLower === 'shaan' || artistLower.includes('shaan ') || artistLower.includes(' shaan') ||
        artistLower.includes('sunidhi') || artistLower.includes('kailash kher') || 
        artistLower.includes('sukhwinder') || artistLower.includes('udit narayan') || artistLower.includes('alka yagnik') ||
        artistLower.includes('asha bhosle') || artistLower.includes('mohammed rafi') || artistLower.includes('a.r. rahman') ||
        artistLower.includes('ar rahman') || artistLower.includes('vishal-shekhar') || artistLower.includes('shankar-ehsaan-loy')) {
      mockTopCities = [
        {
          city: 'Mumbai',
          country: 'India',
          popularity: 98,
          trending: true,
          listeners: 18976543
        },
        {
          city: 'Delhi',
          country: 'India',
          popularity: 96,
          trending: true,
          listeners: 15876432
        },
        {
          city: 'Kolkata',
          country: 'India',
          popularity: 94,
          trending: false,
          listeners: 12654321
        },
        {
          city: 'Bangalore',
          country: 'India',
          popularity: 92,
          trending: true,
          listeners: 11876543
        },
        {
          city: 'Hyderabad',
          country: 'India',
          popularity: 89,
          trending: false,
          listeners: 9876543
        },
        {
          city: 'London',
          country: 'United Kingdom',
          popularity: 76,
          trending: false,
          listeners: 2876543
        },
        {
          city: 'Toronto',
          country: 'Canada',
          popularity: 72,
          trending: false,
          listeners: 2234567
        },
        {
          city: 'New York',
          country: 'United States',
          popularity: 68,
          trending: false,
          listeners: 1987654
        }
      ];
    }
    // K-pop artists - Focus on Asia and global K-pop fanbase
    else if (artistLower.includes('bts') || artistLower.includes('blackpink') || artistLower.includes('twice') ||
             artistLower.includes('stray kids') || artistLower.includes('itzy') || artistLower.includes('aespa') ||
             artistLower.includes('newjeans') || artistLower.includes('ive') || artistLower.includes('seventeen')) {
      mockTopCities = [
        {
          city: 'Seoul',
          country: 'South Korea',
          popularity: 99,
          trending: true,
          listeners: 12876543
        },
        {
          city: 'Tokyo',
          country: 'Japan',
          popularity: 96,
          trending: true,
          listeners: 8456789
        },
        {
          city: 'Manila',
          country: 'Philippines',
          popularity: 94,
          trending: true,
          listeners: 6876543
        },
        {
          city: 'Jakarta',
          country: 'Indonesia',
          popularity: 91,
          trending: false,
          listeners: 5765432
        },
        {
          city: 'Bangkok',
          country: 'Thailand',
          popularity: 88,
          trending: true,
          listeners: 4654321
        },
        {
          city: 'Los Angeles',
          country: 'United States',
          popularity: 85,
          trending: true,
          listeners: 3876543
        },
        {
          city: 'Singapore',
          country: 'Singapore',
          popularity: 82,
          trending: false,
          listeners: 2987654
        },
        {
          city: 'Sydney',
          country: 'Australia',
          popularity: 78,
          trending: false,
          listeners: 2234567
        }
      ];
    }
    // Latin artists - Focus on Latin America and Spanish-speaking regions
    else if (artistLower.includes('bad bunny') || artistLower.includes('j balvin') || artistLower.includes('ozuna') ||
             artistLower.includes('maluma') || artistLower.includes('rosalia') || artistLower.includes('karol g') ||
             artistLower.includes('peso pluma') || artistLower.includes('feid') || artistLower.includes('anuel')) {
      mockTopCities = [
        {
          city: 'Mexico City',
          country: 'Mexico',
          popularity: 98,
          trending: true,
          listeners: 8876543
        },
        {
          city: 'Bogotá',
          country: 'Colombia',
          popularity: 96,
          trending: true,
          listeners: 6456789
        },
        {
          city: 'San Juan',
          country: 'Puerto Rico',
          popularity: 94,
          trending: false,
          listeners: 4876543
        },
        {
          city: 'Buenos Aires',
          country: 'Argentina',
          popularity: 92,
          trending: true,
          listeners: 4765432
        },
        {
          city: 'Madrid',
          country: 'Spain',
          popularity: 89,
          trending: false,
          listeners: 3654321
        },
        {
          city: 'Miami',
          country: 'United States',
          popularity: 87,
          trending: true,
          listeners: 3234567
        },
        {
          city: 'Los Angeles',
          country: 'United States',
          popularity: 84,
          trending: false,
          listeners: 2987654
        },
        {
          city: 'Barcelona',
          country: 'Spain',
          popularity: 81,
          trending: false,
          listeners: 2234567
        }
      ];
    }
    // Global English artists (Western) - US/UK focused with international reach
    else {
      mockTopCities = [
        {
          city: 'Los Angeles',
          country: 'United States',
          popularity: 96,
          trending: true,
          listeners: 6456789
        },
        {
          city: 'New York',
          country: 'United States',
          popularity: 94,
          trending: true,
          listeners: 5876543
        },
        {
          city: 'London',
          country: 'United Kingdom',
          popularity: 91,
          trending: false,
          listeners: 4654321
        },
        {
          city: 'Chicago',
          country: 'United States',
          popularity: 88,
          trending: true,
          listeners: 3765432
        },
        {
          city: 'Toronto',
          country: 'Canada',
          popularity: 85,
          trending: false,
          listeners: 3234567
        },
        {
          city: 'Sydney',
          country: 'Australia',
          popularity: 82,
          trending: false,
          listeners: 2987654
        },
        {
          city: 'Berlin',
          country: 'Germany',
          popularity: 79,
          trending: false,
          listeners: 2234567
        },
        {
          city: 'Paris',
          country: 'France',
          popularity: 76,
          trending: false,
          listeners: 1987654
        }
      ];
    }

    return NextResponse.json({
      success: true,
      topCities: mockTopCities,
      artist: artist
    });
  }

  if (!country) {
    return NextResponse.json({ error: 'Country is required' }, { status: 400 });
  }

  try {
    const baseUrl = API_CONFIG.lastfm.baseUrl;
    const apiKey = API_CONFIG.lastfm.apiKey;
    
    // Use the correct Last.fm geo API format
    const url = `${baseUrl}?method=${method}&country=${encodeURIComponent(country)}&api_key=${apiKey}&format=json&limit=${limit}`;
    
    console.log('Last.fm geo API URL:', url.replace(apiKey, 'REDACTED'));
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ArtistPulse/1.0'
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!response.ok) {
      console.error(`Last.fm geo API HTTP error: ${response.status} ${response.statusText}`);
      
      // Return mock data instead of failing
      return NextResponse.json({
        topartists: {
          artist: [],
          '@attr': {
            country: country,
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
      console.error('Last.fm geo API error:', data.message);
      
      // Return mock data instead of failing
      return NextResponse.json({
        topartists: {
          artist: [],
          '@attr': {
            country: country,
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
    console.error('Last.fm geo API error:', error.message);
    
    // Return mock data instead of failing completely
    return NextResponse.json({
      topartists: {
        artist: [],
        '@attr': {
          country: country,
          page: '1',
          perPage: limit,
          totalPages: '0',
          total: '0'
        }
      }
    });
  }
}

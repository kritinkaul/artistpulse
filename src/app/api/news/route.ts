import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const category = searchParams.get('category') || 'entertainment';

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    // Use exact phrase matching with quotes and filter for entertainment news
    const searchQuery = `"${query}" AND (music OR concert OR album OR tour OR artist)`;
    const response = await fetch(
      `${API_CONFIG.newsapi.baseUrl}/everything?q=${encodeURIComponent(searchQuery)}&apiKey=${API_CONFIG.newsapi.apiKey}&language=en&sortBy=relevancy&pageSize=15&domains=rollingstone.com,billboard.com,pitchfork.com,stereogum.com,consequence.net,spin.com,musicfeeds.com.au`
    );

    if (!response.ok) {
      throw new Error(`News API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Filter articles to ensure they're actually about the artist
    const filteredArticles = data.articles?.filter((article: any) => {
      const title = article.title?.toLowerCase() || '';
      const description = article.description?.toLowerCase() || '';
      const content = article.content?.toLowerCase() || '';
      const queryLower = query.toLowerCase();
      
      // Check if the artist name appears in title, description, or content
      return title.includes(queryLower) || 
             description.includes(queryLower) || 
             content.includes(queryLower);
    }) || [];

    return NextResponse.json({
      ...data,
      articles: filteredArticles,
      totalResults: filteredArticles.length
    });
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news data' },
      { status: 500 }
    );
  }
} 
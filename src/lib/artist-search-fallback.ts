import { API_CONFIG } from '@/lib/api-config';

export interface ArtistSuggestion {
  id: string;
  name: string;
  image?: string;
  followers?: number;
  genres?: string[];
}

function normalizeName(name: string) {
  return name.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
}

async function fetchJson(url: string, timeoutMs = 6000): Promise<any | null> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'ArtistPulse/1.0' },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.warn('Artist search fallback request failed:', url, error);
    return null;
  }
}

async function fetchItunesArtists(query: string): Promise<ArtistSuggestion[]> {
  const data = await fetchJson(
    `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=musicArtist&limit=10`
  );

  return (data?.results || []).map((artist: any) => ({
    id: artist.artistId ? `itunes-${artist.artistId}` : `itunes-${normalizeName(artist.artistName)}`,
    name: artist.artistName,
    genres: artist.primaryGenreName ? [artist.primaryGenreName] : [],
  })).filter((artist: ArtistSuggestion) => Boolean(artist.name));
}

async function fetchDeezerArtists(query: string): Promise<ArtistSuggestion[]> {
  const data = await fetchJson(
    `https://api.deezer.com/search/artist?q=${encodeURIComponent(query)}&limit=10`
  );

  return (data?.data || []).map((artist: any) => ({
    id: artist.id ? `deezer-${artist.id}` : `deezer-${normalizeName(artist.name)}`,
    name: artist.name,
    image: artist.picture_medium || artist.picture || artist.picture_xl,
    followers: artist.nb_fan,
  })).filter((artist: ArtistSuggestion) => Boolean(artist.name));
}

async function fetchLastfmArtists(query: string): Promise<ArtistSuggestion[]> {
  const data = await fetchJson(
    `${API_CONFIG.lastfm.baseUrl}/?method=artist.search&artist=${encodeURIComponent(query)}&api_key=${API_CONFIG.lastfm.apiKey}&format=json&limit=10`
  );

  const matches = data?.results?.artistmatches?.artist;
  const artists = Array.isArray(matches) ? matches : matches ? [matches] : [];

  return artists.map((artist: any) => {
    const images = Array.isArray(artist.image) ? artist.image : [];
    const rawImage = [...images].reverse().find((img: any) => img?.['#text'])?.['#text'];
    const image = rawImage && !rawImage.includes('2a96cbd8b46e442fc41c2b86b821562f') ? rawImage : undefined;
    return {
      id: artist.mbid ? `lastfm-${artist.mbid}` : `lastfm-${normalizeName(artist.name)}`,
      name: artist.name,
      image,
      followers: artist.listeners ? Number(artist.listeners) : undefined,
    };
  }).filter((artist: ArtistSuggestion) => Boolean(artist.name));
}

function isReasonableMatch(name: string, query: string) {
  const n = normalizeName(name);
  const q = normalizeName(query);
  if (!n || !q || q.length < 2) return false;
  if (n === q || n.includes(q) || q.includes(n)) return true;

  const nameParts = n.split(' ').filter(Boolean);
  const queryParts = q.split(' ').filter((part) => part.length > 2);
  return queryParts.length > 0 && queryParts.every((part) => nameParts.some((namePart) => namePart.includes(part) || part.includes(namePart)));
}

export async function searchArtistsFallback(query: string): Promise<ArtistSuggestion[]> {
  const [itunes, deezer, lastfm] = await Promise.all([
    fetchItunesArtists(query),
    fetchDeezerArtists(query),
    fetchLastfmArtists(query),
  ]);

  const byName = new Map<string, ArtistSuggestion>();

  const merge = (artist: ArtistSuggestion) => {
    if (!isReasonableMatch(artist.name, query)) return;
    const key = normalizeName(artist.name);
    if (!key) return;
    const existing = byName.get(key);
    if (!existing) {
      byName.set(key, { ...artist });
      return;
    }
    existing.image = existing.image || artist.image;
    existing.followers = existing.followers || artist.followers;
    if (!existing.genres?.length && artist.genres?.length) {
      existing.genres = artist.genres;
    }
  };

  // iTunes ranks well for music artists; Deezer/Last.fm fill images and extras.
  itunes.forEach(merge);
  deezer.forEach(merge);
  lastfm.forEach(merge);

  const preferred = itunes.length ? itunes : deezer.length ? deezer : lastfm;
  const ranked: ArtistSuggestion[] = [];
  const seen = new Set<string>();

  for (const artist of preferred) {
    const key = normalizeName(artist.name);
    if (seen.has(key)) continue;
    const merged = byName.get(key);
    if (!merged) continue;
    seen.add(key);
    ranked.push(merged);
  }

  const extra = Array.from(byName.values()).filter((artist) => !seen.has(normalizeName(artist.name)));

  return [...ranked, ...extra].slice(0, 10);
}

export function toSpotifyLikeArtist(artist: ArtistSuggestion) {
  return {
    id: artist.id,
    name: artist.name,
    images: artist.image ? [{ url: artist.image }] : [],
    followers: { total: artist.followers || 0 },
    popularity: 0,
    genres: artist.genres || [],
  };
}

import { NextRequest, NextResponse } from 'next/server';
import { TRACKS, ALBUMS } from '@/lib/data';
import { PRODUCTS } from '@/lib/products';

// Static artist data derived from tracks/albums
const STATIC_ARTISTS = [
  {
    id: 'od-porter',
    name: 'O D Porter',
    slug: 'od-porter',
    genre: 'Hip-Hop',
    trackCount: TRACKS.filter((t: any) => t.artist === 'O D Porter').length,
    productCount: PRODUCTS.filter((p: any) => p.artist === 'O D Porter').length,
  }
];

// Static albums as searchable items
const STATIC_ALBUMS = Object.entries(ALBUMS).map(([key, album]: [string, any]) => ({
  id: key.toLowerCase().replace(/\s+/g, '-'),
  name: album.name || key,
  type: 'album',
  artist: 'O D Porter',
  image: album.image,
  year: album.year,
  tracks: album.tracks,
}));

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ artists: [], products: [], tracks: [], albums: [] });
  }

  const searchTerm = query.toLowerCase().trim();

  try {
    // Search static artists
    const artists = STATIC_ARTISTS.filter((artist: any) => 
      artist.name.toLowerCase().includes(searchTerm) ||
      artist.slug.toLowerCase().includes(searchTerm)
    );

    // Search static albums
    const albums = STATIC_ALBUMS.filter((album: any) =>
      album.name.toLowerCase().includes(searchTerm) ||
      album.artist.toLowerCase().includes(searchTerm)
    );

    // Search static tracks
    const tracks = TRACKS.filter((track: any) =>
      track.title.toLowerCase().includes(searchTerm) ||
      track.artist.toLowerCase().includes(searchTerm) ||
      (track.album && track.album.toLowerCase().includes(searchTerm))
    ).slice(0, 10).map((track: any) => ({
      id: track.id,
      title: track.title,
      artist: track.artist,
      album: track.album,
      image: track.image,
      duration: track.duration,
      price: track.price,
    }));

    // Search static products
    const products = PRODUCTS.filter((product: any) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.artist.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    ).slice(0, 5).map((product: any) => ({
      id: product.id,
      name: product.name,
      artistName: product.artist,
      price: product.price,
      image: product.image,
      category: product.category,
    }));

    return NextResponse.json({
      artists,
      albums,
      tracks,
      products,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
// Real placeholder products for the marketplace
export const PRODUCTS = [
  // Artist Merch
  {
    id: 'ambiguous-tee',
    name: 'Ambiguous Tour Tee',
    artist: 'O D Porter',
    price: 28,
    category: 'merch',
    type: 'Apparel',
    description: 'Premium cotton tee from the Ambiguous tour. Soft, breathable, built to last.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    colors: ['Black', 'White', 'Orange'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    artistCut: 22.40,
    sales: 142,
    rating: 4.8,
    reviews: 89
  },
  {
    id: 'ambiguous-hoodie',
    name: 'Ambiguous Hoodie',
    artist: 'O D Porter',
    price: 65,
    category: 'merch',
    type: 'Apparel',
    description: 'Heavyweight hoodie with embroidered logo.',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
    colors: ['Black', 'Gray'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    artistCut: 52,
    sales: 78,
    rating: 4.9,
    reviews: 45
  },
  {
    id: 'ambiguous-vinyl',
    name: 'Ambiguous Vinyl',
    artist: 'O D Porter',
    price: 35,
    category: 'music',
    type: 'Vinyl',
    description: 'Limited edition vinyl. 180g audiophile quality.',
    image: 'https://images.unsplash.com/photo-1539185441755-7697f0f1e3ee?w=500',
    format: '12" Vinyl',
    tracks: 21,
    inStock: true,
    artistCut: 28,
    sales: 234,
    rating: 5.0,
    reviews: 67
  }
];

// Featured artists
export const ARTISTS = [
  {
    id: 'od-porter',
    name: 'O D Porter',
    genre: 'Hip-Hop / R&B',
    location: 'St. Louis, MO',
    bio: 'St. Louis artist blending hip-hop, R&B, and soul. Born in Miami, raised in New Orleans & St. Louis.',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb1614b109?w=500',
    verified: true,
    supporters: 2847,
    earnings: 8947,
    tracks: 58,
    products: 3
  }
];

// ALBUMS with cover art
export const ALBUMS = {
  ambiguous: {
    id: 'ambiguous',
    name: 'Ambiguous',
    artist: 'O D Porter',
    year: 2024,
    image: '/album-art/Ambiguous.jpg',
    tracks: 21
  },
  roxannity: {
    id: 'roxannity',
    name: 'Roxannity',
    artist: 'O D Porter',
    year: 2024,
    image: '/album-art/Roxannity.jpg',
    tracks: 16
  },
  oneDay: {
    id: 'one-day',
    name: 'One Day',
    artist: 'O D Porter',
    year: 2024,
    image: '/album-art/One_Day.jpg',
    tracks: 19
  },
  godIsGood: {
    id: 'god-is-good',
    name: 'God Is Good',
    artist: 'O D Porter',
    year: 2024,
    image: '/album-art/God_Is_Good.jpg',
    tracks: 1
  },
  afterEffects: {
    id: 'after-effects',
    name: 'After Effects',
    artist: 'O D Porter',
    year: 2024,
    image: '/covers/after-effects-cover.png',
    tracks: 1
  }
};

// CDN base URL for audio
const CDN_BASE = 'https://tsdjmiqczgxnkpvirkya.supabase.co/storage/v1/object/public/audio/albums';

// ALL TRACKS - Organized by album with CDN audio URLs
export const TRACKS = [
  // AMBIGUOUS ALBUM (21 tracks) - ✅ UPLOADED
  { id: 'oddysee', title: 'Oddysee', artist: 'O D Porter', album: 'Ambiguous', duration: '2:44', price: 1, plays: 125000, image: '/album-art/Ambiguous.jpg', audio_url: `${CDN_BASE}/Ambiguous/01%20Oddysee.mp3` },
  { id: 'zarah', title: 'Zarah', artist: 'O D Porter', album: 'Ambiguous', duration: '3:34', price: 1, plays: 89000, image: '/album-art/Ambiguous.jpg', audio_url: `${CDN_BASE}/Ambiguous/02%20Zarah.mp3` },
  { id: 'dopamines', title: 'Dopamines', artist: 'O D Porter', album: 'Ambiguous', duration: '3:26', price: 1, plays: 67000, image: '/album-art/Ambiguous.jpg', audio_url: `${CDN_BASE}/Ambiguous/03%20Dopamines.mp3` },
  { id: 'i-like-all', title: 'I Like All', artist: 'O D Porter', album: 'Ambiguous', duration: '4:04', price: 1, plays: 45000, image: '/album-art/Ambiguous.jpg', audio_url: `${CDN_BASE}/Ambiguous/04%20I%20Like%20All.mp3` },
  { id: 'danielles-dance', title: 'Danielles Dance', artist: 'O D Porter', album: 'Ambiguous', duration: '3:26', price: 1, plays: 72000, image: '/album-art/Ambiguous.jpg', audio_url: `${CDN_BASE}/Ambiguous/05%20Danielles%20Dance.mp3` },
  { id: 'make-a-move', title: 'Make A Move', artist: 'O D Porter', album: 'Ambiguous', duration: '3:51', price: 1, plays: 152000, image: '/album-art/Ambiguous.jpg', audio_url: `${CDN_BASE}/Ambiguous/06%20Make%20A%20Move.mp3` },
  { id: 'pack-down', title: 'Pack Down', artist: 'O D Porter', album: 'Ambiguous', duration: '4:29', price: 1, plays: 39000, image: '/album-art/Ambiguous.jpg', audio_url: `${CDN_BASE}/Ambiguous/07%20Pack%20Down.mp3` },
  { id: 'lust-for-love', title: 'Lust For Love', artist: 'O D Porter', album: 'Ambiguous', duration: '4:41', price: 1, plays: 35000, image: '/album-art/Ambiguous.jpg', audio_url: `${CDN_BASE}/Ambiguous/08%20Lust%20For%20Love.mp3` },
  { id: 'oxymoron', title: 'Oxymoron (Interlude)', artist: 'O D Porter', album: 'Ambiguous', duration: '2:42', price: 1, plays: 35000, image: '/album-art/Ambiguous.jpg', audio_url: `${CDN_BASE}/Ambiguous/09%20Oxymoron%20(interlude).mp3` },
  { id: 'briauns-house', title: "Briauns House", artist: 'O D Porter', album: 'Ambiguous', duration: '4:00', price: 1, plays: 48000, image: '/album-art/Ambiguous.jpg', audio_url: `${CDN_BASE}/Ambiguous/10%20Briauns%20House.mp3` },
  { id: 'torys-total-trip', title: "Tory's Total Trip", artist: 'O D Porter', album: 'Ambiguous', duration: '4:30', price: 1, plays: 39000, image: '/album-art/Ambiguous.jpg', audio_url: `${CDN_BASE}/Ambiguous/11%20Torys%20Total%20Trip.mp3` },
  { id: 'lecole', title: 'LeCole', artist: 'O D Porter', album: 'Ambiguous', duration: '4:36', price: 1, plays: 35000, image: '/album-art/Ambiguous.jpg', audio_url: `${CDN_BASE}/Ambiguous/12%20LeCole.mp3` },
  { id: 'cypher', title: 'Cypher', artist: 'O D Porter', album: 'Ambiguous', duration: '4:22', price: 1, plays: 38000, image: '/album-art/Ambiguous.jpg', audio_url: `${CDN_BASE}/Ambiguous/13%20Cypher.mp3` },
  { id: 'bible', title: 'Bible', artist: 'O D Porter', album: 'Ambiguous', duration: '2:44', price: 1, plays: 34000, image: '/album-art/Ambiguous.jpg', audio_url: `${CDN_BASE}/Ambiguous/14%20Bible.mp3` },
  { id: 'dirty-world', title: 'Dirty World', artist: 'O D Porter', album: 'Ambiguous', duration: '3:01', price: 1, plays: 43000, image: '/album-art/Ambiguous.jpg', audio_url: `${CDN_BASE}/Ambiguous/15%20Dirty%20World.mp3` },
  { id: 'the-employee', title: 'The Employee', artist: 'O D Porter', album: 'Ambiguous', duration: '4:00', price: 1, plays: 36000, image: '/album-art/Ambiguous.jpg', audio_url: `${CDN_BASE}/Ambiguous/16%20The%20Employee.mp3` },
  { id: 'veni-vidi-vici', title: 'Veni Vidi Vici', artist: 'O D Porter', album: 'Ambiguous', duration: '2:30', price: 1, plays: 40000, image: '/album-art/Ambiguous.jpg', audio_url: `${CDN_BASE}/Ambiguous/17%20Veni%20Vidi%20Vici.mp3` },
  { id: 'pack-down-remix', title: 'Pack Down (Remix)', artist: 'O D Porter', album: 'Ambiguous', duration: '4:29', price: 1, plays: 27000, image: '/album-art/Ambiguous.jpg', audio_url: `${CDN_BASE}/Ambiguous/18%20Pack%20Down%20(Remix).mp3` },
  { id: 'lil-playa', title: 'Lil Playa', artist: 'O D Porter', album: 'Ambiguous', duration: '2:57', price: 1, plays: 60000, image: '/album-art/Ambiguous.jpg', audio_url: `${CDN_BASE}/Ambiguous/19%20Lil%20Playa.mp3` },
  { id: 'nostalgism', title: 'Nostalgism', artist: 'O D Porter', album: 'Ambiguous', duration: '3:02', price: 1, plays: 31000, image: '/album-art/Ambiguous.jpg', audio_url: `${CDN_BASE}/Ambiguous/20%20Nostalgism.mp3` },
  { id: 'enlightened', title: 'Enlightened', artist: 'O D Porter', album: 'Ambiguous', duration: '3:40', price: 1, plays: 28000, image: '/album-art/Ambiguous.jpg', audio_url: `${CDN_BASE}/Ambiguous/21%20Enlightened.mp3` },

  // ROXANNITY ALBUM (16 tracks)
  { id: 'roxannity-intro', title: 'Roxannity (Intro)', artist: 'O D Porter', album: 'Roxannity', duration: '3:23', price: 1, plays: 54000, image: '/album-art/Roxannity.jpg' },
  { id: 'decomposure', title: 'Decomposure', artist: 'O D Porter', album: 'Roxannity', duration: '2:17', price: 1, plays: 42000, image: '/album-art/Roxannity.jpg' },
  { id: 'freak-like-me', title: 'Freak Like Me', artist: 'O D Porter', album: 'Roxannity', duration: '3:40', price: 1, plays: 78000, image: '/album-art/Roxannity.jpg' },
  { id: 'spoken-wordz', title: 'Spoken Wordz', artist: 'O D Porter', album: 'Roxannity', duration: '3:56', price: 1, plays: 51000, image: '/album-art/Roxannity.jpg' },
  { id: 'heart-and-soul', title: 'Heart & Soul', artist: 'O D Porter', album: 'Roxannity', duration: '2:31', price: 1, plays: 65000, image: '/album-art/Roxannity.jpg' },
  { id: 'no-more', title: 'No More', artist: 'O D Porter', album: 'Roxannity', duration: '1:29', price: 1, plays: 89000, image: '/album-art/Roxannity.jpg' },
  { id: 'gotta-get-it', title: 'Gotta Get It', artist: 'O D Porter', album: 'Roxannity', duration: '2:33', price: 1, plays: 47000, image: '/album-art/Roxannity.jpg' },
  { id: 'job', title: 'Job', artist: 'O D Porter', album: 'Roxannity', duration: '2:31', price: 1, plays: 38000, image: '/album-art/Roxannity.jpg' },
  { id: 'pure-lust', title: 'Pure Lust', artist: 'O D Porter', album: 'Roxannity', duration: '1:51', price: 1, plays: 52000, image: '/album-art/Roxannity.jpg' },
  { id: 'red-pill-or-blue', title: 'Red Pill or The Blue', artist: 'O D Porter', album: 'Roxannity', duration: '3:06', price: 1, plays: 44000, image: '/album-art/Roxannity.jpg' },
  { id: 'outsider', title: 'Outsider', artist: 'O D Porter', album: 'Roxannity', duration: '3:16', price: 1, plays: 39000, image: '/album-art/Roxannity.jpg' },
  { id: 'you-better-stop', title: 'You Better Stop', artist: 'O D Porter', album: 'Roxannity', duration: '3:05', price: 1, plays: 41000, image: '/album-art/Roxannity.jpg' },
  { id: 'rose', title: 'Rose', artist: 'O D Porter', album: 'Roxannity', duration: '4:06', price: 1, plays: 67000, image: '/album-art/Roxannity.jpg' },
  { id: 'my-testamony', title: 'My Testamony', artist: 'O D Porter', album: 'Roxannity', duration: '1:32', price: 1, plays: 33000, image: '/album-art/Roxannity.jpg' },

  // ONE DAY ALBUM (19 tracks)
  { id: 'the-intro', title: 'The Intro', artist: 'O D Porter', album: 'One Day', duration: '1:32', price: 1, plays: 23000, image: '/album-art/One_Day.jpg' },
  { id: 'pushn', title: "Push'N", artist: 'O D Porter', album: 'One Day', duration: '4:03', price: 1, plays: 21000, image: '/album-art/One_Day.jpg' },
  { id: 'real-definition', title: 'Real Definition', artist: 'O D Porter', album: 'One Day', duration: '4:16', price: 1, plays: 19000, image: '/album-art/One_Day.jpg' },
  { id: 'bandflow', title: 'BandFlow', artist: 'O D Porter', album: 'One Day', duration: '3:04', price: 1, plays: 23000, image: '/album-art/One_Day.jpg' },
  { id: 'mfcch', title: 'MFCCH', artist: 'O D Porter', album: 'One Day', duration: '2:26', price: 1, plays: 19000, image: '/album-art/One_Day.jpg' },
  { id: 'best-wishes', title: 'Best Wishes', artist: 'O D Porter', album: 'One Day', duration: '3:36', price: 1, plays: 19000, image: '/album-art/One_Day.jpg' },
  { id: 'one-day-title', title: 'One Day', artist: 'O D Porter', album: 'One Day', duration: '3:58', price: 1, plays: 21000, image: '/album-art/One_Day.jpg' },
  { id: 'back-at-it', title: 'Back At It', artist: 'O D Porter', album: 'One Day', duration: '4:18', price: 1, plays: 12000, image: '/album-art/One_Day.jpg' },
  { id: 'same-house', title: 'Same House', artist: 'O D Porter', album: 'One Day', duration: '3:12', price: 1, plays: 19000, image: '/album-art/One_Day.jpg' },
  { id: 'sunshine', title: 'Sunshine', artist: 'O D Porter', album: 'One Day', duration: '3:40', price: 1, plays: 15000, image: '/album-art/One_Day.jpg' },
  { id: 'calling-for-me', title: 'Calling For Me', artist: 'O D Porter', album: 'One Day', duration: '3:57', price: 1, plays: 17000, image: '/album-art/One_Day.jpg' },
  { id: 'artgasm', title: 'Artgasm', artist: 'O D Porter', album: 'One Day', duration: '2:26', price: 1, plays: 18000, image: '/album-art/One_Day.jpg' },
  { id: 'the-interlude', title: 'The Interlude', artist: 'O D Porter', album: 'One Day', duration: '0:57', price: 1, plays: 50000, image: '/album-art/One_Day.jpg' },
  { id: 'silhouette', title: 'Silhouette', artist: 'O D Porter', album: 'One Day', duration: '4:00', price: 1, plays: 17000, image: '/album-art/One_Day.jpg' },
  { id: 'street-love', title: 'Street Love', artist: 'O D Porter', album: 'One Day', duration: '3:21', price: 1, plays: 13000, image: '/album-art/One_Day.jpg' },
  { id: 'tracey-porter', title: 'Tracey Porter', artist: 'O D Porter', album: 'One Day', duration: '3:43', price: 1, plays: 12000, image: '/album-art/One_Day.jpg' },
  { id: 'plus', title: 'Plus', artist: 'O D Porter', album: 'One Day', duration: '2:08', price: 1, plays: 16000, image: '/album-art/One_Day.jpg' },
  { id: 'mike-tyson', title: 'Mike Tyson (One Round)', artist: 'O D Porter', album: 'One Day', duration: '1:43', price: 1, plays: 19000, image: '/album-art/One_Day.jpg' },

  // SINGLES
  { id: 'too-stingy', title: 'Too Stingy', artist: 'O D Porter', album: 'Singles', duration: '3:15', price: 1, plays: 89000, image: '/covers/too-stingy-cover.png' },
  { id: 'god-is-good', title: 'God Is Good', artist: 'O D Porter', album: 'Singles', duration: '4:21', price: 1, plays: 67000, image: '/album-art/God_Is_Good.jpg' },
  { id: 'after-effects', title: 'After Effects', artist: 'O D Porter', album: 'Singles', duration: '4:00', price: 1, plays: 28000, image: '/covers/after-effects-cover.png' }
];
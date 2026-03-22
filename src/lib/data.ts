// CDN base URL for audio files
const CDN_BASE = 'https://tsdjmiqczgxnkpvirkya.supabase.co/storage/v1/object/public/audio/albums';

// Helper to get CDN URL for a track
function getAudioUrl(album: string, filename: string): string {
  const encodedAlbum = encodeURIComponent(album);
  const encodedFile = encodeURIComponent(filename);
  return `${CDN_BASE}/${encodedAlbum}/${encodedFile}`;
}

// ALL TRACKS - Organized by album with CDN audio URLs
export const TRACKS = [
  // AMBIGUOUS ALBUM (21 tracks) - ✅ WORKING ON CDN
  { id: 'oddysee', title: 'Oddysee', artist: 'O D Porter', album: 'Ambiguous', duration: '2:44', price: 1, plays: 125000, image: '/album-art/Ambiguous.jpg', audio_url: getAudioUrl('Ambiguous', '01 Oddysee.mp3') },
  { id: 'zarah', title: 'Zarah', artist: 'O D Porter', album: 'Ambiguous', duration: '3:34', price: 1, plays: 89000, image: '/album-art/Ambiguous.jpg', audio_url: getAudioUrl('Ambiguous', '02 Zarah.mp3') },
  { id: 'dopamines', title: 'Dopamines', artist: 'O D Porter', album: 'Ambiguous', duration: '3:26', price: 1, plays: 67000, image: '/album-art/Ambiguous.jpg', audio_url: getAudioUrl('Ambiguous', '03 Dopamines.mp3') },
  { id: 'i-like-all', title: 'I Like All', artist: 'O D Porter', album: 'Ambiguous', duration: '4:04', price: 1, plays: 45000, image: '/album-art/Ambiguous.jpg', audio_url: getAudioUrl('Ambiguous', '04 I Like All.mp3') },
  { id: 'danielles-dance', title: 'Danielles Dance', artist: 'O D Porter', album: 'Ambiguous', duration: '3:26', price: 1, plays: 72000, image: '/album-art/Ambiguous.jpg', audio_url: getAudioUrl('Ambiguous', '05 Danielles Dance.mp3') },
  { id: 'make-a-move', title: 'Make A Move', artist: 'O D Porter', album: 'Ambiguous', duration: '3:51', price: 1, plays: 152000, image: '/album-art/Ambiguous.jpg', audio_url: getAudioUrl('Ambiguous', '06 Make A Move.mp3') },
  { id: 'pack-down', title: 'Pack Down', artist: 'O D Porter', album: 'Ambiguous', duration: '4:29', price: 1, plays: 39000, image: '/album-art/Ambiguous.jpg', audio_url: getAudioUrl('Ambiguous', '07 Pack Down.mp3') },
  { id: 'lust-for-love', title: 'Lust For Love', artist: 'O D Porter', album: 'Ambiguous', duration: '4:41', price: 1, plays: 35000, image: '/album-art/Ambiguous.jpg', audio_url: getAudioUrl('Ambiguous', '08 Lust For Love.mp3') },
  { id: 'oxymoron', title: 'Oxymoron (Interlude)', artist: 'O D Porter', album: 'Ambiguous', duration: '2:42', price: 1, plays: 35000, image: '/album-art/Ambiguous.jpg', audio_url: getAudioUrl('Ambiguous', '09 Oxymoron (interlude).mp3') },
  { id: 'briauns-house', title: "Briauns House", artist: 'O D Porter', album: 'Ambiguous', duration: '4:00', price: 1, plays: 48000, image: '/album-art/Ambiguous.jpg', audio_url: getAudioUrl('Ambiguous', '10 Briauns House.mp3') },
  { id: 'torys-total-trip', title: "Tory's Total Trip", artist: 'O D Porter', album: 'Ambiguous', duration: '4:30', price: 1, plays: 39000, image: '/album-art/Ambiguous.jpg', audio_url: getAudioUrl('Ambiguous', '11 Torys Total Trip.mp3') },
  { id: 'lecole', title: 'LeCole', artist: 'O D Porter', album: 'Ambiguous', duration: '4:36', price: 1, plays: 35000, image: '/album-art/Ambiguous.jpg', audio_url: getAudioUrl('Ambiguous', '12 LeCole.mp3') },
  { id: 'cypher', title: 'Cypher', artist: 'O D Porter', album: 'Ambiguous', duration: '4:22', price: 1, plays: 38000, image: '/album-art/Ambiguous.jpg', audio_url: getAudioUrl('Ambiguous', '13 Cypher.mp3') },
  { id: 'bible', title: 'Bible', artist: 'O D Porter', album: 'Ambiguous', duration: '2:44', price: 1, plays: 34000, image: '/album-art/Ambiguous.jpg', audio_url: getAudioUrl('Ambiguous', '14 Bible.mp3') },
  { id: 'dirty-world', title: 'Dirty World', artist: 'O D Porter', album: 'Ambiguous', duration: '3:01', price: 1, plays: 43000, image: '/album-art/Ambiguous.jpg', audio_url: getAudioUrl('Ambiguous', '15 Dirty World.mp3') },
  { id: 'the-employee', title: 'The Employee', artist: 'O D Porter', album: 'Ambiguous', duration: '4:00', price: 1, plays: 36000, image: '/album-art/Ambiguous.jpg', audio_url: getAudioUrl('Ambiguous', '16 The Employee.mp3') },
  { id: 'veni-vidi-vici', title: 'Veni Vidi Vici', artist: 'O D Porter', album: 'Ambiguous', duration: '2:30', price: 1, plays: 40000, image: '/album-art/Ambiguous.jpg', audio_url: getAudioUrl('Ambiguous', '17 Veni Vidi Vici.mp3') },
  { id: 'pack-down-remix', title: 'Pack Down (Remix)', artist: 'O D Porter', album: 'Ambiguous', duration: '4:29', price: 1, plays: 27000, image: '/album-art/Ambiguous.jpg', audio_url: getAudioUrl('Ambiguous', '18 Pack Down (Remix).mp3') },
  { id: 'lil-playa', title: 'Lil Playa', artist: 'O D Porter', album: 'Ambiguous', duration: '2:57', price: 1, plays: 60000, image: '/album-art/Ambiguous.jpg', audio_url: getAudioUrl('Ambiguous', '19 Lil Playa.mp3') },
  { id: 'nostalgism', title: 'Nostalgism', artist: 'O D Porter', album: 'Ambiguous', duration: '3:02', price: 1, plays: 31000, image: '/album-art/Ambiguous.jpg', audio_url: getAudioUrl('Ambiguous', '20 Nostalgism.mp3') },
  { id: 'enlightened', title: 'Enlightened', artist: 'O D Porter', album: 'Ambiguous', duration: '3:40', price: 1, plays: 28000, image: '/album-art/Ambiguous.jpg', audio_url: getAudioUrl('Ambiguous', '21 Enlightened.mp3') },

  // ROXANNITY ALBUM (16 tracks)
  { id: 'roxannity-intro', title: 'Roxannity (Intro)', artist: 'O D Porter', album: 'Roxannity', duration: '3:23', price: 1, plays: 54000, image: '/album-art/Roxannity.jpg' },
  { id: 'decomposure', title: 'Decomposure', artist: 'O D Porter', album: 'Roxannity', duration: '2:17', price: 1, plays: 42000, image: '/album-art/Roxannity.jpg' },
  { id: 'freak-like-me', title: 'Freak Like Me', artist: 'O D Porter', album: 'Roxannity', duration: '3:40', price: 1, plays: 78000, image: '/album-art/Roxannity.jpg' },
  { id: 'spoken-wordz', title: 'Spoken Wordz', artist: 'O D Porter', album: 'Roxannity', duration: '3:56', price: 1, plays: 51000, image: '/album-art/Roxannity.jpg' },
  { id: 'heart-and-soul', title: 'Heart & Soul', artist: 'O D Porter', album: 'Roxannity', duration: '2:31', price: 1, plays: 65000, image: '/album-art/Roxannity.jpg' },
  { id: 'no-more', title: 'No More', artist: 'O D Porter', album: 'Roxannity', duration: '1:29', price: 1, plays: 89000, image: '/album-art/Roxannity.jpg' },
  { id: 'gotta-get-it', title: 'Gotta Get It', artist: 'O D Porter', album: 'Roxannity', duration: '2:33', price: 1, plays: 47000, image: '/album-art/Roxannity.jpg' },
  { id: 'job', title: 'Job', artist: 'O D Porter', album: 'Roxannity', duration: '2:14', price: 1, plays: 32000, image: '/album-art/Roxannity.jpg' },
  { id: 'pure-lust', title: 'Pure Lust', artist: 'O D Porter', album: 'Roxannity', duration: '3:29', price: 1, plays: 58000, image: '/album-art/Roxannity.jpg' },
  { id: 'roxanne', title: 'Roxanne', artist: 'O D Porter', album: 'Roxannity', duration: '3:45', price: 1, plays: 92000, image: '/album-art/Roxannity.jpg' },
  { id: 'deja-vu', title: 'Deja Vu', artist: 'O D Porter', album: 'Roxannity', duration: '3:12', price: 1, plays: 44000, image: '/album-art/Roxannity.jpg' },
  { id: 'let-go', title: 'Let Go', artist: 'O D Porter', album: 'Roxannity', duration: '2:48', price: 1, plays: 38000, image: '/album-art/Roxannity.jpg' },
  { id: 'cant-explain', title: "Can't Explain", artist: 'O D Porter', album: 'Roxannity', duration: '3:01', price: 1, plays: 41000, image: '/album-art/Roxannity.jpg' },
  { id: 'feel-it', title: 'Feel It', artist: 'O D Porter', album: 'Roxannity', duration: '2:55', price: 1, plays: 55000, image: '/album-art/Roxannity.jpg' },
  { id: 'stay-down', title: 'Stay Down', artist: 'O D Porter', album: 'Roxannity', duration: '3:33', price: 1, plays: 37000, image: '/album-art/Roxannity.jpg' },
  { id: 'roxannity-outro', title: 'Roxannity (Outro)', artist: 'O D Porter', album: 'Roxannity', duration: '2:18', price: 1, plays: 29000, image: '/album-art/Roxannity.jpg' },

  // Add other albums following same pattern...
  // ONE DAY, FROM FEAST TO FAMINE, GOD IS GOOD, STREETS THOUGHT I LEFT, ARTGASM, LEVI
  // (Keeping existing track data, will add CDN URLs when uploads complete)
];

export { TRACKS };

// Export helper for CDN URLs
export { getAudioUrl };
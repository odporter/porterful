import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tsdjmiqczgxnkpvirkya.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzZGptaXFjemd4bmtwdmlya3lhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAyOTYzNiwiZXhwIjoyMDg5NjA1NjM2fQ.7PAvqsXolPTLionRlvH0caLz20KUjQGE5-e8yHzZacc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupAudioColumn() {
  console.log('🔧 Adding audio_url column to tracks table...\n');
  
  // Try to select from tracks to see current columns
  const { data, error } = await supabase
    .from('tracks')
    .select('id, title, artist, album, duration, audio_url, cover_url')
    .limit(1);
  
  if (error) {
    console.log('Current error:', error.message);
    console.log('\n⚠️  You need to run this SQL in Supabase:');
    console.log('https://supabase.com/dashboard/project/tsdjmiqczgxnkpvirkya/sql/new\n');
    console.log('```sql');
    console.log('ALTER TABLE tracks ADD COLUMN IF NOT EXISTS audio_url TEXT;');
    console.log('ALTER TABLE tracks ADD COLUMN IF NOT EXISTS cover_url TEXT;');
    console.log('```');
    return;
  }
  
  console.log('✅ Columns already exist or query succeeded');
}

setupAudioColumn();

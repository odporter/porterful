import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tsdjmiqczgxnkpvirkya.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzZGptaXFjemd4bmtwdmlya3lhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAyOTYzNiwiZXhwIjoyMDg5NjA1NjM2fQ.7PAvqsXolPTLionRlvH0caLz20KUjQGE5-e8yHzZacc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAudio() {
  const { data, error } = await supabase
    .from('tracks')
    .select('id, title, album, audio_url')
    .limit(5);
  
  if (error) {
    console.log('Error:', error.message);
    return;
  }
  
  console.log('=== TRACKS WITH AUDIO ===\n');
  data.forEach(t => {
    console.log(`${t.title} (${t.album})`);
    console.log(`  audio_url: ${t.audio_url || 'NULL'}`);
    console.log('');
  });
}

checkAudio();

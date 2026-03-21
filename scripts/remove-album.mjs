import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tsdjmiqczgxnkpvirkya.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzZGptaXFjemd4bmtwdmlya3lhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAyOTYzNiwiZXhwIjoyMDg5NjA1NjM2fQ.7PAvqsXolPTLionRlvH0caLz20KUjQGE5-e8yHzZacc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function removeAlbum() {
  console.log('🗑️  Removing "Every Instrumentals"...\n');
  
  const { data, error } = await supabase
    .from('tracks')
    .delete()
    .eq('album', 'Every Instrumentals')
    .select('title');
  
  if (error) {
    console.log('❌ Error:', error.message);
  } else if (data) {
    console.log(`✅ Removed ${data.length} tracks from Every Instrumentals`);
    data.forEach(t => console.log(`   - ${t.title}`));
  }
}

removeAlbum().catch(console.error);

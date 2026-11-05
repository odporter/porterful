import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tsdjmiqczgxnkpvirkya.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzZGptaXFjemd4bmtwdmlya3lhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAyOTYzNiwiZXhwIjoyMDg5NjA1NjM2fQ.7PAvqsXolPTLionRlvH0caLz20KUjQGE5-e8yHzZacc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function removeDuplicate() {
  // Remove Cypher from Singles (keep the one in Ambiguous)
  const { data, error } = await supabase
    .from('tracks')
    .delete()
    .eq('title', 'Cypher')
    .eq('album', 'Singles')
    .select('id, title');
  
  if (error) {
    console.log('Error:', error.message);
  } else if (data && data.length > 0) {
    console.log(`✅ Removed duplicate Cypher from Singles (${data[0].id})`);
  } else {
    console.log('No Cypher in Singles found');
  }
  
  // Check remaining Cypher
  const { data: remaining } = await supabase
    .from('tracks')
    .select('id, title, album')
    .eq('title', 'Cypher');
  
  console.log('\nRemaining Cypher tracks:');
  remaining?.forEach(t => console.log(`  - ${t.title} (${t.album})`));
}

removeDuplicate();

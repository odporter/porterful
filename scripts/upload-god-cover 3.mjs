import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = 'https://tsdjmiqczgxnkpvirkya.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzZGptaXFjemd4bmtwdmlya3lhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAyOTYzNiwiZXhwIjoyMDg5NjA1NjM2fQ.7PAvqsXolPTLionRlvH0caLz20KUjQGE5-e8yHzZacc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadCover() {
  console.log('🎨 Uploading God is Good cover...\n');
  
  const filePath = '/Users/odjonathan/Documents/Porterful/porterful-app/public/album-art/God_Is_Good.jpg';
  const fileData = readFileSync(filePath);
  
  // Upload to Supabase
  const { error: uploadError } = await supabase.storage
    .from('music')
    .upload('album-art/God_Is_Good.jpg', fileData, {
      contentType: 'image/jpeg',
      upsert: true,
    });
  
  if (uploadError) {
    console.log('Upload error:', uploadError.message);
    return;
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('music')
    .getPublicUrl('album-art/God_Is_Good.jpg');
  
  console.log('✅ Uploaded to:', publicUrl);
  
  // Update all God is Good tracks
  const { error: updateError } = await supabase
    .from('tracks')
    .update({ cover_url: publicUrl })
    .eq('album', 'God Is Good');
  
  if (updateError) {
    console.log('Update error:', updateError.message);
  } else {
    console.log('✅ Updated God is Good tracks with cover art');
  }
}

uploadCover();

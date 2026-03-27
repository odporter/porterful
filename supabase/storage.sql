-- Create storage bucket for music files
INSERT INTO storage.buckets (id, name, public)
VALUES ('music', 'music', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for artist images
INSERT INTO storage.buckets (id, name, public)
VALUES ('artist-images', 'artist-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy for music uploads (artists can upload)
CREATE POLICY "Artists can upload music"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'music' 
  AND auth.uid() IN (SELECT id FROM profiles WHERE role IN ('artist', 'admin'))
);

-- Policy for public read access to music
CREATE POLICY "Public can read music"
ON storage.objects FOR SELECT
USING (bucket_id = 'music');

-- Policy for artists to update their own music
CREATE POLICY "Artists can update own music"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'music'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for artists to delete their own music
CREATE POLICY "Artists can delete own music"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'music'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
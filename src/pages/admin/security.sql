-- Enable RLS on all tables
ALTER TABLE viagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE galeria_momentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;

-- Create policies for Public Read Access
CREATE POLICY "Public Read Viagens" ON viagens FOR SELECT USING (true);
CREATE POLICY "Public Read Galeria" ON galeria_momentos FOR SELECT USING (true);
CREATE POLICY "Public Read FAQ" ON faq FOR SELECT USING (true);
CREATE POLICY "Public Read Config" ON configuracoes FOR SELECT USING (true);

-- Create policies for Admin Write Access (Authenticated users only)
CREATE POLICY "Admin All Viagens" ON viagens FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Galeria" ON galeria_momentos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All FAQ" ON faq FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Config" ON configuracoes FOR ALL USING (auth.role() = 'authenticated');

-- Storage Policies (Run these if you haven't set up storage policies in the UI)
-- Note: You need to replace 'bucket_id' with your actual bucket names if different

-- Policy for 'viagens' bucket
-- CREATE POLICY "Public Access Viagens Bucket" ON storage.objects FOR SELECT USING (bucket_id = 'viagens');
-- CREATE POLICY "Admin Upload Viagens Bucket" ON storage.objects FOR INSERT USING (bucket_id = 'viagens' AND auth.role() = 'authenticated');
-- CREATE POLICY "Admin Update Viagens Bucket" ON storage.objects FOR UPDATE USING (bucket_id = 'viagens' AND auth.role() = 'authenticated');
-- CREATE POLICY "Admin Delete Viagens Bucket" ON storage.objects FOR DELETE USING (bucket_id = 'viagens' AND auth.role() = 'authenticated');

-- Policy for 'galeria' bucket
-- CREATE POLICY "Public Access Galeria Bucket" ON storage.objects FOR SELECT USING (bucket_id = 'galeria');
-- CREATE POLICY "Admin Upload Galeria Bucket" ON storage.objects FOR INSERT USING (bucket_id = 'galeria' AND auth.role() = 'authenticated');
-- CREATE POLICY "Admin Update Galeria Bucket" ON storage.objects FOR UPDATE USING (bucket_id = 'galeria' AND auth.role() = 'authenticated');
-- CREATE POLICY "Admin Delete Galeria Bucket" ON storage.objects FOR DELETE USING (bucket_id = 'galeria' AND auth.role() = 'authenticated');

-- Policy for 'covers' bucket
-- CREATE POLICY "Public Access Covers Bucket" ON storage.objects FOR SELECT USING (bucket_id = 'covers');
-- CREATE POLICY "Admin Upload Covers Bucket" ON storage.objects FOR INSERT USING (bucket_id = 'covers' AND auth.role() = 'authenticated');
-- CREATE POLICY "Admin Update Covers Bucket" ON storage.objects FOR UPDATE USING (bucket_id = 'covers' AND auth.role() = 'authenticated');
-- CREATE POLICY "Admin Delete Covers Bucket" ON storage.objects FOR DELETE USING (bucket_id = 'covers' AND auth.role() = 'authenticated');
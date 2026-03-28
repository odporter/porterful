-- Seed Trending Products (high-margin dropshipping picks)
-- Source: 2026 dropshipping research

-- First, clear any existing trending products
DELETE FROM products WHERE category = 'trending';

-- Insert trending products with profit margins
INSERT INTO products (category, name, description, price, cost, images, is_active, commission_rate) VALUES
-- Wellness (30-55% margins)
('trending', 'Red Light Therapy Face Mask', 'Spa-grade results at home. Replaces $150 facial treatments.', 69.99, 22, '["https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=500"]', true, 0.10),
('trending', 'Smart Posture Corrector', 'Vibrates when posture slips. Remote work ergonomics essential.', 39.99, 10, '["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500"]', true, 0.10),
('trending', 'Acupressure Mat & Pillow Set', 'Replaces $80 massage therapy sessions.', 55.99, 15, '["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500"]', true, 0.10),
('trending', 'Gua Sha Stone Set (Jade)', 'High perceived value. Pairs with face oils for repeat purchases.', 28.99, 4, '["https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500"]', true, 0.10),
('trending', 'Infrared Heating Pad', 'App-controlled timer. Alternative to chiropractor visits.', 65.99, 18, '["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500"]', true, 0.10),
('trending', 'Lymphatic Drainage Massager', 'Wellness trend tied to inflammation reduction.', 38.99, 10, '["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500"]', true, 0.10),
('trending', 'Eye Massage Mask (Heat + Vibration)', 'Screen fatigue relief for gamers and programmers.', 55.99, 16, '["https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=500"]', true, 0.10),

-- Emotional Support Home Decor (40-65% margins)
('trending', 'Weighted Dinosaur Plushie', 'Emotional support dinosaur. 300% search spike!', 38.99, 10, '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500"]', true, 0.10),
('trending', 'Galaxy Projector (App-Controlled)', 'Creates calming atmosphere. Strong visual appeal.', 59.99, 18, '["https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=500"]', true, 0.10),
('trending', 'Sunset Lamp (Color-Changing)', 'Affordable mood lighting. Instagram aesthetic must-have.', 45.99, 14, '["https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=500"]', true, 0.10),
('trending', 'Flame Effect Essential Oil Diffuser', 'Multi-sensory experience. Sell oils for repeat revenue.', 69.99, 20, '["https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500"]', true, 0.10),
('trending', 'Diatomite Bath Mat', 'Super-absorbent. Solves wet floor problem.', 36.99, 10, '["https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500"]', true, 0.10),

-- Kitchen & Organization (35-60% margins)
('trending', 'Silicone Air Fryer Liners (Set of 2)', 'Gets dirty, needs replacement. Air fryer ownership at all-time high.', 18.99, 4, '["https://images.unsplash.com/photo-1585527396378-2e21a01cfd1c?w=500"]', true, 0.10),
('trending', 'Multi-Blade Vegetable Chopper', 'Time-saving. Satisfying demo videos.', 35.99, 10, '["https://images.unsplash.com/photo-1585527396378-2e21a01cfd1c?w=500"]', true, 0.10),
('trending', 'Magnetic Spice Rack System', 'Organization + space-saving.', 52.99, 15, '["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"]', true, 0.10),
('trending', 'Oil Sprayer Bottle (Mist Function)', 'Health-conscious cooking.', 22.99, 5, '["https://images.unsplash.com/photo-1585527396378-2e21a01cfd1c?w=500"]', true, 0.10),
('trending', 'Automatic Soap Dispenser (Touchless)', 'Hygiene concern. Battery-operated convenience.', 32.99, 10, '["https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500"]', true, 0.10),
('trending', 'Silicone Stretch Lids (Set of 6)', 'Replaces plastic wrap. Eco-friendly.', 24.99, 6, '["https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=500"]', true, 0.10),

-- Fitness (40-65% margins)
('trending', 'Smart Jump Rope (Counter Display)', 'Cardio in minimal space. App integration.', 39.99, 12, '["https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500"]', true, 0.10),
('trending', 'Yoga Mat with Alignment Lines', 'Beginner-friendly guidance.', 36.99, 10, '["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500"]', true, 0.10),
('trending', 'Textured Foam Roller', 'Recovery tool. Replaces massage therapy.', 32.99, 9, '["https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500"]', true, 0.10),
('trending', 'Instant Cooling Towel', 'Summer essential. Sports/outdoor market.', 18.99, 4, '["https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500"]', true, 0.10),
('trending', 'Doorway Pull-Up Bar (No-Installation)', 'Full upper body workout. Apartment-friendly.', 49.99, 15, '["https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500"]', true, 0.10),
('trending', 'Resistance Bands Set (Multiple Strengths)', 'Eventually lose tension. Fitness trend.', 28.99, 7, '["https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500"]', true, 0.10),

-- Tech Accessories
('trending', 'Wireless Earbuds Pro', 'Noise cancelling, 24hr battery.', 49.99, 18, '["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500"]', true, 0.10),
('trending', 'Braided Fast Charge Cable', 'Everyone needs extras.', 14.99, 4, '["https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500"]', true, 0.10),
('trending', 'Magnetic Phone Mount (Car)', 'Strong magnet. One-hand operation.', 19.99, 6, '["https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500"]', true, 0.10);

-- Add category index
CREATE INDEX IF NOT EXISTS idx_products_trending ON products(category) WHERE category = 'trending';
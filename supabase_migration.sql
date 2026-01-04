-- Create events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  deadline DATE NOT NULL,
  razorpay_link TEXT NOT NULL,
  google_form_url TEXT,
  image_url TEXT,
  course_map_url TEXT,
  registration_status TEXT DEFAULT 'open' CHECK (registration_status IN ('open', 'closed'))
);

-- Create event_categories table
CREATE TABLE event_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL
);

-- Create event_info_sections table
CREATE TABLE event_info_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  "order" INTEGER NOT NULL
);

-- Create event_sponsors table
CREATE TABLE event_sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  "order" INTEGER NOT NULL
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_info_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_sponsors ENABLE ROW LEVEL SECURITY;

-- Create policies (allow public read, authenticated write for now)
CREATE POLICY "Allow public read access" ON events FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON event_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON event_info_sections FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON event_sponsors FOR SELECT USING (true);

-- For admin operations, you can add authenticated policies or use service role key
CREATE POLICY "Allow authenticated insert" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated insert" ON event_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated insert" ON event_info_sections FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated insert" ON event_sponsors FOR INSERT WITH CHECK (true);

-- Create storage bucket for event images
INSERT INTO storage.buckets (id, name, public) VALUES ('event-images', 'event-images', true);

-- Storage policy
CREATE POLICY "Allow public read" ON storage.objects FOR SELECT USING (bucket_id = 'event-images');
CREATE POLICY "Allow authenticated upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'event-images');

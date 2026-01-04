-- Add missing UPDATE and DELETE policies for admin operations

-- Events table policies
CREATE POLICY "Allow update" ON events FOR UPDATE USING (true);
CREATE POLICY "Allow delete" ON events FOR DELETE USING (true);

-- Categories table policies  
CREATE POLICY "Allow update" ON event_categories FOR UPDATE USING (true);
CREATE POLICY "Allow delete" ON event_categories FOR DELETE USING (true);

-- Info sections table policies
CREATE POLICY "Allow update" ON event_info_sections FOR UPDATE USING (true);
CREATE POLICY "Allow delete" ON event_info_sections FOR DELETE USING (true);

-- Sponsors table policies
CREATE POLICY "Allow update" ON event_sponsors FOR UPDATE USING (true);
CREATE POLICY "Allow delete" ON event_sponsors FOR DELETE USING (true);

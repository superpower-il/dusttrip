-- Delete all existing regions (make sure no trips reference them first)
DELETE FROM regions;

-- Add unique constraint to prevent future duplicates
ALTER TABLE regions DROP CONSTRAINT IF EXISTS regions_name_unique;
ALTER TABLE regions ADD CONSTRAINT regions_name_unique UNIQUE (name);

-- Insert regions fresh
INSERT INTO regions (name, name_en) VALUES
  ('נגב', 'Negev'),
  ('גולן', 'Golan'),
  ('יהודה ושומרון', 'Judea and Samaria'),
  ('ערבה', 'Arava'),
  ('גליל', 'Galilee'),
  ('שפלה', 'Shephelah'),
  ('מרכז', 'Center')
ON CONFLICT (name) DO NOTHING;

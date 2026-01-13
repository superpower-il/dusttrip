-- DustTrip Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  avatar_url TEXT,
  address TEXT,
  address_lat DECIMAL,
  address_lng DECIMAL,
  is_leader BOOLEAN DEFAULT FALSE,
  leader_approved_at TIMESTAMP,
  leader_bio TEXT,
  leader_experience TEXT,
  leader_specialties TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles ON DELETE CASCADE NOT NULL,
  manufacturer TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  is_lifted BOOLEAN DEFAULT FALSE,
  has_lockers BOOLEAN DEFAULT FALSE,
  has_low_gear BOOLEAN DEFAULT FALSE,
  is_armored BOOLEAN DEFAULT FALSE,
  has_rescue_gear BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create regions table
CREATE TABLE IF NOT EXISTS regions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_en TEXT
);

-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  leader_id UUID REFERENCES profiles ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  region_id UUID REFERENCES regions,
  specific_location TEXT,
  meeting_point_address TEXT,
  meeting_point_lat DECIMAL,
  meeting_point_lng DECIMAL,
  start_date TIMESTAMP NOT NULL,
  duration_hours INTEGER,
  includes_overnight BOOLEAN DEFAULT FALSE,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  min_participants INTEGER DEFAULT 1,
  max_vehicles INTEGER NOT NULL,
  price DECIMAL,
  ofroad_link TEXT,
  requires_lifted BOOLEAN DEFAULT FALSE,
  requires_lockers BOOLEAN DEFAULT FALSE,
  requires_low_gear BOOLEAN DEFAULT FALSE,
  requires_armored BOOLEAN DEFAULT FALSE,
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create trip_registrations table
CREATE TABLE IF NOT EXISTS trip_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles ON DELETE CASCADE NOT NULL,
  vehicle_id UUID REFERENCES vehicles ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'waitlist', 'cancelled')),
  rejection_reason TEXT,
  waitlist_position INTEGER,
  registered_at TIMESTAMP DEFAULT NOW(),
  status_updated_at TIMESTAMP,
  UNIQUE(trip_id, user_id)
);

-- Create leader_requests table
CREATE TABLE IF NOT EXISTS leader_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles ON DELETE CASCADE NOT NULL,
  experience_description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES profiles,
  created_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP
);

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips ON DELETE CASCADE NOT NULL,
  from_user_id UUID REFERENCES profiles ON DELETE CASCADE NOT NULL,
  to_leader_id UUID REFERENCES profiles ON DELETE CASCADE NOT NULL,
  score INTEGER CHECK (score >= 1 AND score <= 5),
  review TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(trip_id, from_user_id)
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID REFERENCES profiles ON DELETE CASCADE PRIMARY KEY,
  preferred_regions UUID[],
  preferred_difficulties TEXT[],
  weekends_only BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create notifications_log table
CREATE TABLE IF NOT EXISTS notifications_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  content JSONB,
  sent_at TIMESTAMP DEFAULT NOW(),
  whatsapp_message_id TEXT
);

-- Insert sample regions
INSERT INTO regions (name, name_en) VALUES
  ('נגב', 'Negev'),
  ('גולן', 'Golan'),
  ('יהודה ושומרון', 'Judea and Samaria'),
  ('ערבה', 'Arava'),
  ('גליל', 'Galilee'),
  ('שפלה', 'Shephelah'),
  ('מרכז', 'Center')
ON CONFLICT DO NOTHING;

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE leader_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications_log ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Vehicles policies
DROP POLICY IF EXISTS "Vehicles are viewable by everyone" ON vehicles;
CREATE POLICY "Vehicles are viewable by everyone" ON vehicles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own vehicles" ON vehicles;
CREATE POLICY "Users can insert own vehicles" ON vehicles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own vehicles" ON vehicles;
CREATE POLICY "Users can update own vehicles" ON vehicles
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own vehicles" ON vehicles;
CREATE POLICY "Users can delete own vehicles" ON vehicles
  FOR DELETE USING (auth.uid() = user_id);

-- Regions policies (read-only for everyone)
DROP POLICY IF EXISTS "Regions are viewable by everyone" ON regions;
CREATE POLICY "Regions are viewable by everyone" ON regions
  FOR SELECT USING (true);

-- Trips policies
DROP POLICY IF EXISTS "Trips are viewable by everyone" ON trips;
CREATE POLICY "Trips are viewable by everyone" ON trips
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Leaders can create trips" ON trips;
CREATE POLICY "Leaders can create trips" ON trips
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND is_leader = TRUE
    )
  );

DROP POLICY IF EXISTS "Leaders can update own trips" ON trips;
CREATE POLICY "Leaders can update own trips" ON trips
  FOR UPDATE USING (auth.uid() = leader_id);

DROP POLICY IF EXISTS "Leaders can delete own trips" ON trips;
CREATE POLICY "Leaders can delete own trips" ON trips
  FOR DELETE USING (auth.uid() = leader_id);

-- Trip registrations policies
DROP POLICY IF EXISTS "Users can view registrations for their trips or own registrations" ON trip_registrations;
CREATE POLICY "Users can view registrations for their trips or own registrations" ON trip_registrations
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_id AND trips.leader_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert own registrations" ON trip_registrations;
CREATE POLICY "Users can insert own registrations" ON trip_registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own registrations" ON trip_registrations;
CREATE POLICY "Users can update own registrations" ON trip_registrations
  FOR UPDATE USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_id AND trips.leader_id = auth.uid())
  );

-- Leader requests policies
DROP POLICY IF EXISTS "Users can view own leader requests" ON leader_requests;
CREATE POLICY "Users can view own leader requests" ON leader_requests
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own leader requests" ON leader_requests;
CREATE POLICY "Users can insert own leader requests" ON leader_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Ratings policies
DROP POLICY IF EXISTS "Ratings are viewable by everyone" ON ratings;
CREATE POLICY "Ratings are viewable by everyone" ON ratings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own ratings" ON ratings;
CREATE POLICY "Users can insert own ratings" ON ratings
  FOR INSERT WITH CHECK (
    auth.uid() = from_user_id AND
    EXISTS (
      SELECT 1 FROM trip_registrations 
      WHERE trip_id = ratings.trip_id 
      AND user_id = auth.uid()
      AND status = 'approved'
    )
  );

-- User preferences policies
DROP POLICY IF EXISTS "Users can view own preferences" ON user_preferences;
CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;
CREATE POLICY "Users can insert own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;
CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Notifications log policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications_log;
CREATE POLICY "Users can view own notifications" ON notifications_log
  FOR SELECT USING (auth.uid() = user_id);

-- Function to handle new user creation (creates profile automatically)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

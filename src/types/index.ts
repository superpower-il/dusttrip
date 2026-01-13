export interface Profile {
  id: string
  full_name: string
  phone: string
  avatar_url?: string
  address?: string
  address_lat?: number
  address_lng?: number
  is_leader: boolean
  leader_approved_at?: string
  leader_bio?: string
  leader_experience?: string
  leader_specialties?: string[]
  created_at: string
}

export interface Vehicle {
  id: string
  user_id: string
  manufacturer: string
  model: string
  year?: number
  is_lifted: boolean
  has_lockers: boolean
  has_low_gear: boolean
  is_armored: boolean
  has_rescue_gear: boolean
  created_at: string
}

export interface Region {
  id: string
  name: string
  name_en?: string
}

export interface Trip {
  id: string
  leader_id: string
  title: string
  description?: string
  region_id?: string
  specific_location?: string
  meeting_point_address?: string
  meeting_point_lat?: number
  meeting_point_lng?: number
  start_date: string
  duration_hours?: number
  includes_overnight: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  min_participants: number
  max_vehicles: number
  price?: number
  ofroad_link?: string
  requires_lifted: boolean
  requires_lockers: boolean
  requires_low_gear: boolean
  requires_armored: boolean
  notes?: string
  status: 'active' | 'cancelled' | 'completed'
  created_at: string
}

// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key for admin operations
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Types for our database
export interface User {
  id: string;
  club_id: string;
  name: string;
  email: string;
  team_id?: string;
  created_at: string;
}

export interface Team {
  id: string;
  code: string;
  event_id: string;
  score: number;
  good_interval: number;
  created_at: string;
  members?: User[];
  submissions?: Submission[];
}

export interface Question {
  id: string;
  text: string;
  answer: number;
  released: boolean;
  created_at: string;
  submissions?: Submission[];
}

export interface Submission {
  id: string;
  team_id: string;
  question_id: string;
  min_value: number;
  max_value: number;
  created_at: string;
  team?: Team;
  question?: Question;
}
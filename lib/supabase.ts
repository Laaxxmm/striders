import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface Event {
    id: string;
    created_at: string;
    name: string;
    date: string;
    time: string;
    location: string;
    description: string;
    deadline: string;
    razorpay_link: string;
    google_form_url?: string;
    image_url?: string;
    course_map_url?: string;
    registration_status: 'open' | 'closed';
}

export interface EventCategory {
    id: string;
    event_id: string;
    name: string;
    price: number;
}

export interface EventInfoSection {
    id: string;
    event_id: string;
    title: string;
    content: string;
    order: number;
}

export interface EventSponsor {
    id: string;
    event_id: string;
    name: string;
    logo_url: string;
    order: number;
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

if (!isSupabaseConfigured) {
  console.warn(
    '⚠️ Supabase URL atau Anon Key belum diatur! ' +
    'Silakan buat file .env dan isi VITE_SUPABASE_URL serta VITE_SUPABASE_ANON_KEY jika ingin terhubung ke database Supabase.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vdxmxeprvqiwbuimjmzh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkeG14ZXBydnFpd2J1aW1qbXpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2OTQ0MzcsImV4cCI6MjA2MTI3MDQzN30.0BH07GIJkUH4yBgAc0E4V6hZJ_Mh-jLxtigER2Ea4y4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

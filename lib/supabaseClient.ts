import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vebodqomozbywmstynwh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlYm9kcW9tb3pieXdtc3R5bndoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0OTQwNzgsImV4cCI6MjA3ODA3MDA3OH0.KPDgRsPSOWLOBYbkaZ1s0cFuzBb2cLEtI9nLEGa5G_A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

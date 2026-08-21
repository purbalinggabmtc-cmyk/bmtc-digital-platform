// Supabase connection
const SUPABASE_URL = "MASUKKAN_URL_SUPABASE";

const SUPABASE_KEY = "MASUKKAN_ANON_KEY";


const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

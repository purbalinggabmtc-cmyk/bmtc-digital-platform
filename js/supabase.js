// ======================================
// BMTC SUPABASE CONNECTION
// ======================================


// Supabase Project URL

const SUPABASE_URL =
"https://yrvnmmascklkuzpjkwxn.supabase.co";



// Supabase Publishable Key

const SUPABASE_KEY =
"sb_publishable_YGi3tPBuF9tW4KKnLJ5dDQ_AcBZ19WH";




// Create Supabase Client
// Single source of Supabase connection


const client =

supabase.createClient(

    SUPABASE_URL,

    SUPABASE_KEY,

    {

        auth: {

            persistSession: true,

            autoRefreshToken: true,

            detectSessionInUrl: true

        }

    }

);

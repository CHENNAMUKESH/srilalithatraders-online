// SRI LALITHA TRADERS - Supabase configuration
// 1. Create a Supabase project.
// 2. Paste Project URL and anon/public key below.
// Never put the service_role key in this website.

const SUPABASE_URL = "https://jsqajggrdthsytqntxhk.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_wCEOssCHjqvdkopcaMA6cw_Y1Nqri4z";

window.SUPABASE_READY =
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("PASTE_YOUR") &&
  SUPABASE_ANON_KEY.length > 20;

window.supabaseClient = window.SUPABASE_READY
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

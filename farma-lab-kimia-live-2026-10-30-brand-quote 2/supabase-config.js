// Public browser configuration only. Never place a Supabase service_role key here.
window.FARMA_SUPABASE_CONFIG = {
  url: "https://aqynbasvtgcnahwfjgab.supabase.co",
  anonKey: "sb_publishable_SP-rW1WulGXfXU41JP80hg_s3IePeRj"
};
window.farmaSupabaseReady = new Promise((resolve) => { window.resolveFarmaSupabase = resolve; });

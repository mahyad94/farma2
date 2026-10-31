const config = window.FARMA_SUPABASE_CONFIG || {};
if (config.url && config.anonKey) {
  try {
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    window.farmaSupabase = createClient(config.url, config.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    window.resolveFarmaSupabase?.(window.farmaSupabase);
  } catch (error) {
    console.error("Supabase client could not load.", error);
    window.resolveFarmaSupabase?.(null);
  }
} else {
  window.resolveFarmaSupabase?.(null);
}

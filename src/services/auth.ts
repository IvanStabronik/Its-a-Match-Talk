import { isSupabaseConfigured, supabase } from '@/services/supabase';

export async function ensureAnonymousSession(): Promise<string | null> {
  if (!isSupabaseConfigured) return null;

  const { data: existing } = await supabase.auth.getSession();
  if (existing.session?.user?.id) {
    return existing.session.user.id;
  }

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error || !data.user) {
    console.warn('Anonymous sign-in failed', error?.message);
    return null;
  }
  return data.user.id;
}

export async function getAccessToken(): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

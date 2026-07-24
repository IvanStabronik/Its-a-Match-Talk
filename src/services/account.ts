import { ensureAnonymousSession } from '@/services/auth';
import { clearSnapshot } from '@/services/compare';
import { isSupabaseConfigured, supabase } from '@/services/supabase';
import { useConversationStore } from '@/stores/conversationStore';
import { useFlagStore } from '@/stores/flagStore';
import { useSettingsStore } from '@/stores/settingsStore';

/** Wipe local app state; best-effort remote delete when Edge is deployed. */
export async function deleteAllUserData(): Promise<{ remote: boolean }> {
  let remote = false;

  if (isSupabaseConfigured) {
    try {
      await ensureAnonymousSession();
      const { error } = await supabase.functions.invoke('delete-me');
      if (!error) remote = true;
    } catch {
      remote = false;
    }

    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }

  await clearSnapshot();
  useConversationStore.getState().reset();
  useFlagStore.getState().clearEvents();
  useSettingsStore.getState().resetLocalData();

  return { remote };
}

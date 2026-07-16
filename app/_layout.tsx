import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ensureAnonymousSession } from '@/services/auth';
import { isSupabaseConfigured } from '@/services/supabase';

export default function RootLayout() {
  useEffect(() => {
    if (isSupabaseConfigured) {
      ensureAnonymousSession().catch(() => undefined);
    }
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
    </SafeAreaProvider>
  );
}

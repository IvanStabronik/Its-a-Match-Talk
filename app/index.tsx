import { Redirect } from 'expo-router';

import { useSettingsStore } from '@/stores/settingsStore';

export default function Index() {
  const ageConfirmed = useSettingsStore((s) => s.ageConfirmed);
  const privacyAccepted = useSettingsStore((s) => s.privacyAccepted);

  if (!ageConfirmed) return <Redirect href="/age-gate" />;
  if (!privacyAccepted) return <Redirect href="/privacy" />;
  return <Redirect href="/welcome" />;
}

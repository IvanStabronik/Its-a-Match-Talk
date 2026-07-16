import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { resolveDeviceLocale, setI18nLocale } from '@/i18n';
import type { AppLocale } from '@/types/domain';

type SettingsState = {
  locale: AppLocale;
  ageConfirmed: boolean;
  privacyAccepted: boolean;
  freeGenerationsUsed: number;
  setLocale: (locale: AppLocale) => void;
  confirmAge: () => void;
  acceptPrivacy: () => void;
  incrementGenerationsUsed: () => void;
  setFreeGenerationsUsed: (count: number) => void;
  resetGenerationsUsed: () => void;
};

const initialLocale = resolveDeviceLocale();
setI18nLocale(initialLocale);

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      locale: initialLocale,
      ageConfirmed: false,
      privacyAccepted: false,
      freeGenerationsUsed: 0,
      setLocale: (locale) => {
        setI18nLocale(locale);
        set({ locale });
      },
      confirmAge: () => set({ ageConfirmed: true }),
      acceptPrivacy: () => set({ privacyAccepted: true }),
      incrementGenerationsUsed: () =>
        set((state) => ({ freeGenerationsUsed: state.freeGenerationsUsed + 1 })),
      setFreeGenerationsUsed: (count) => set({ freeGenerationsUsed: count }),
      resetGenerationsUsed: () => set({ freeGenerationsUsed: 0 }),
    }),
    {
      name: 'imt-settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        locale: state.locale,
        ageConfirmed: state.ageConfirmed,
        privacyAccepted: state.privacyAccepted,
        freeGenerationsUsed: state.freeGenerationsUsed,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.locale) {
          setI18nLocale(state.locale);
        }
      },
    },
  ),
);

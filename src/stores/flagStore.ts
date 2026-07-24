import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type FlagKind =
  | 'cancelled_plan'
  | 'disappeared'
  | 'broken_promise'
  | 'initiative'
  | 'conflict'
  | 'boundary_respect';

export type FlagPolarity = 'red' | 'green';

export type FlagEvent = {
  id: string;
  kind: FlagKind;
  polarity: FlagPolarity;
  note: string;
  at: string;
};

type FlagState = {
  events: FlagEvent[];
  addEvent: (input: Omit<FlagEvent, 'id' | 'at'> & { at?: string }) => void;
  removeEvent: (id: string) => void;
  clearEvents: () => void;
};

const KIND_DEFAULT_POLARITY: Record<FlagKind, FlagPolarity> = {
  cancelled_plan: 'red',
  disappeared: 'red',
  broken_promise: 'red',
  initiative: 'green',
  conflict: 'red',
  boundary_respect: 'green',
};

export function defaultPolarity(kind: FlagKind): FlagPolarity {
  return KIND_DEFAULT_POLARITY[kind];
}

export const FLAG_KINDS: FlagKind[] = [
  'cancelled_plan',
  'disappeared',
  'broken_promise',
  'initiative',
  'conflict',
  'boundary_respect',
];

export const useFlagStore = create<FlagState>()(
  persist(
    (set) => ({
      events: [],
      addEvent: (input) =>
        set((state) => ({
          events: [
            {
              id: `flag-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              kind: input.kind,
              polarity: input.polarity,
              note: input.note.trim().slice(0, 280),
              at: input.at ?? new Date().toISOString(),
            },
            ...state.events,
          ].slice(0, 200),
        })),
      removeEvent: (id) => set((state) => ({ events: state.events.filter((e) => e.id !== id) })),
      clearEvents: () => set({ events: [] }),
    }),
    {
      name: 'imt-flag-log',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ events: state.events }),
    },
  ),
);

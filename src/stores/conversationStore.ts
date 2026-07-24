import { create } from 'zustand';

import type { AnalysisCompare } from '@/services/compare';
import type {
  AnalysisResult,
  EffortBalance,
  GoalId,
  Message,
  RegionId,
  Reply,
  ToneId,
} from '@/types/domain';

type ConversationState = {
  messages: Message[];
  rawPaste: string;
  goal: GoalId;
  tone: ToneId;
  region: RegionId;
  replies: Reply[];
  effort: EffortBalance | null;
  analysis: AnalysisResult | null;
  compare: AnalysisCompare | null;
  setRawPaste: (text: string) => void;
  setMessages: (messages: Message[]) => void;
  updateMessage: (id: string, patch: Partial<Message>) => void;
  setGoal: (goal: GoalId) => void;
  setTone: (tone: ToneId) => void;
  setRegion: (region: RegionId) => void;
  setReplies: (replies: Reply[]) => void;
  setAnalysis: (analysis: AnalysisResult) => void;
  setCompare: (compare: AnalysisCompare | null) => void;
  reset: () => void;
};

const defaultState = {
  messages: [] as Message[],
  rawPaste: '',
  goal: 'keep-it-going' as GoalId,
  tone: 'playful' as ToneId,
  region: 'Auto' as RegionId,
  replies: [] as Reply[],
  effort: null as EffortBalance | null,
  analysis: null as AnalysisResult | null,
  compare: null as AnalysisCompare | null,
};

export const useConversationStore = create<ConversationState>((set) => ({
  ...defaultState,
  setRawPaste: (rawPaste) => set({ rawPaste }),
  setMessages: (messages) => set({ messages }),
  updateMessage: (id, patch) =>
    set((state) => ({
      messages: state.messages.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    })),
  setGoal: (goal) => set({ goal }),
  setTone: (tone) => set({ tone }),
  setRegion: (region) => set({ region }),
  setReplies: (replies) => set({ replies }),
  setAnalysis: (analysis) =>
    set({
      analysis,
      effort: analysis.effort,
      replies: analysis.paid?.replies ?? [],
    }),
  setCompare: (compare) => set({ compare }),
  reset: () => set({ ...defaultState }),
}));

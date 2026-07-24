export type Speaker = 'me' | 'them' | 'unknown';

export type Message = {
  id: string;
  speaker: Speaker;
  text: string;
};

export type GoalId =
  | 'keep-it-going'
  | 'flirt-lightly'
  | 'ask-for-date'
  | 'get-contact'
  | 'recover-awkward'
  | 'clarify-intent'
  | 'reply-politely'
  | 'end-respectfully';

export type ToneId = 'soft' | 'playful' | 'confident' | 'direct' | 'bold';

export type ReplyVariant = 'Safe' | 'Playful' | 'Bold';

export type RegionId =
  | 'Auto'
  | 'Diaspora-EU'
  | 'PL'
  | 'UA'
  | 'RU-Moscow'
  | 'RU-Piter'
  | 'RU-Regions'
  | 'KZ'
  | 'BY';

export type AppLocale = 'ru' | 'uk' | 'pl' | 'en';

export type Reply = {
  variant: ReplyVariant;
  text: string;
  whyThisWorks: string;
};

export type InterestTrend = 'up' | 'flat' | 'down';
export type GhostBand = 'low' | 'medium' | 'high';

export type EffortBalance = {
  mePercent: number;
  themPercent: number;
  initiationMe: number;
  initiationThem: number;
  volumeMe: number;
  volumeThem: number;
  questionsMe: number;
  questionsThem: number;
  messageCountMe: number;
  messageCountThem: number;
  bulletKeys: string[];
};

export type HotColdSegment = {
  label: 'early' | 'mid' | 'late';
  engagement: number;
};

export type AnalysisInsights = {
  effort: EffortBalance;
  interestTrend: InterestTrend;
  ghostRisk: GhostBand;
  timeline: HotColdSegment[];
  nextStepKey: string;
  nextStepDetailKey: string;
  replies: Reply[];
};

export type GenerationRequest = {
  messages: Message[];
  goal: GoalId;
  tone: ToneId;
  region: RegionId;
  locale: AppLocale;
};

export type GenerationResult = {
  replies: Reply[];
  detectedRegion?: RegionId;
  freeGenerationsUsed?: number;
};

export type AnalysisResult = {
  effort: EffortBalance;
  /** Present when premium / full analyze ran */
  paid?: Omit<AnalysisInsights, 'effort'>;
  detectedRegion?: RegionId;
  freeGenerationsUsed?: number;
};

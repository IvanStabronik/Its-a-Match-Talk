import type { GoalId, RegionId, ToneId } from '@/types/domain';

export type GoalConfig = {
  id: GoalId;
  labelKey: string;
  descriptionKey: string;
};

export type ToneConfig = {
  id: ToneId;
  labelKey: string;
  descriptionKey: string;
};

export type RegionConfig = {
  id: RegionId;
  labelKey: string;
};

export const GOALS: GoalConfig[] = [
  { id: 'keep-it-going', labelKey: 'goals.keepItGoing.label', descriptionKey: 'goals.keepItGoing.description' },
  { id: 'flirt-lightly', labelKey: 'goals.flirtLightly.label', descriptionKey: 'goals.flirtLightly.description' },
  { id: 'ask-for-date', labelKey: 'goals.askForDate.label', descriptionKey: 'goals.askForDate.description' },
  { id: 'get-contact', labelKey: 'goals.getContact.label', descriptionKey: 'goals.getContact.description' },
  { id: 'recover-awkward', labelKey: 'goals.recoverAwkward.label', descriptionKey: 'goals.recoverAwkward.description' },
  { id: 'clarify-intent', labelKey: 'goals.clarifyIntent.label', descriptionKey: 'goals.clarifyIntent.description' },
  { id: 'reply-politely', labelKey: 'goals.replyPolitely.label', descriptionKey: 'goals.replyPolitely.description' },
  { id: 'end-respectfully', labelKey: 'goals.endRespectfully.label', descriptionKey: 'goals.endRespectfully.description' },
];

export const TONES: ToneConfig[] = [
  { id: 'soft', labelKey: 'tones.soft.label', descriptionKey: 'tones.soft.description' },
  { id: 'playful', labelKey: 'tones.playful.label', descriptionKey: 'tones.playful.description' },
  { id: 'confident', labelKey: 'tones.confident.label', descriptionKey: 'tones.confident.description' },
  { id: 'direct', labelKey: 'tones.direct.label', descriptionKey: 'tones.direct.description' },
  { id: 'bold', labelKey: 'tones.bold.label', descriptionKey: 'tones.bold.description' },
];

export const REGIONS: RegionConfig[] = [
  { id: 'Auto', labelKey: 'regions.auto' },
  { id: 'Diaspora-EU', labelKey: 'regions.diasporaEu' },
  { id: 'PL', labelKey: 'regions.pl' },
  { id: 'UA', labelKey: 'regions.ua' },
  { id: 'RU-Moscow', labelKey: 'regions.ruMoscow' },
  { id: 'RU-Piter', labelKey: 'regions.ruPiter' },
  { id: 'RU-Regions', labelKey: 'regions.ruRegions' },
  { id: 'KZ', labelKey: 'regions.kz' },
  { id: 'BY', labelKey: 'regions.by' },
];

export const REPLY_VARIANT_KEYS = {
  Safe: 'results.variantSafe',
  Playful: 'results.variantPlayful',
  Bold: 'results.variantBold',
} as const;

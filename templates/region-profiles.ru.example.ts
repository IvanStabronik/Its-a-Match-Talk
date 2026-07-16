/**
 * RU region tone profiles — starter template.
 * Copy to: src/config/regionProfiles.ru.ts
 *           supabase/functions/_shared/regionProfiles.ts
 *
 * Keep client + server copies in sync (как в Cue).
 */

export type Region =
  | 'Auto'
  | 'RU-Moscow'
  | 'RU-Piter'
  | 'RU-Regions'
  | 'KZ'
  | 'BY'
  | 'Diaspora-EU';

type ConcreteRegion = Exclude<Region, 'Auto'>;

export interface RegionToneProfile {
  characteristics: string[];
  avoidPatterns: string[];
  bannedPhrases: string[];
  humorStyle: string;
  formalityLevel: 'informal' | 'semi-formal' | 'formal';
  maxEmojis: number;
}

export const REGION_PROFILES: Record<ConcreteRegion, RegionToneProfile> = {
  'RU-Moscow': {
    characteristics: [
      'прямой',
      'уверенный',
      'короткие фразы',
      'без воды',
      'лёгкая ирония',
    ],
    avoidPatterns: [
      'канцелярит',
      'пафос',
      'излишняя вежливость',
      'длинные сложные предложения',
    ],
    bannedPhrases: [
      'моя королева',
      'ты одна такая',
      'даме',
      'сударь',
      'альфа-самец',
      'frame control',
    ],
    humorStyle: 'лёгкая ирония, умеренные мемы, без занудства',
    formalityLevel: 'informal',
    maxEmojis: 2,
  },

  'RU-Piter': {
    characteristics: [
      'ирония',
      'самоирония',
      'чуть отстранённый',
      'сухой юмор',
      'без напора',
    ],
    avoidPatterns: [
      'московский напор',
      'пафос',
      'чрезмерный энтузиазм',
      'канцелярит',
    ],
    bannedPhrases: [
      'в столице так не делают',
      'моя королева',
      'ты одна такая',
    ],
    humorStyle: 'сухой стёб, самоирония, питерская отстранённость',
    formalityLevel: 'informal',
    maxEmojis: 2,
  },

  'RU-Regions': {
    characteristics: [
      'теплее',
      'проще',
      'естественный разговорный русский',
      'без столичного снобизма',
    ],
    avoidPatterns: [
      'московский сленг',
      'сложные конструкции',
      'интеллигентщина',
    ],
    bannedPhrases: [
      'моя королева',
      'ты одна такая',
      'альфа-самец',
      'нейротип',
    ],
    humorStyle: 'добрый юмор, без сарказма над собеседником',
    formalityLevel: 'informal',
    maxEmojis: 2,
  },

  KZ: {
    characteristics: [
      'уважительный',
      'без излишней фамильярности на старте',
      'тёплый но сдержанный',
    ],
    avoidPatterns: [
      'российский политический контекст',
      'грубый сленг',
      'навязчивость',
    ],
    bannedPhrases: [
      'моя королева',
      'ты мне так нужна',
      'почему молчишь',
    ],
    humorStyle: 'лёгкий, без стёба над культурой',
    formalityLevel: 'semi-formal',
    maxEmojis: 2,
  },

  BY: {
    characteristics: [
      'спокойный',
      'дружелюбный',
      'без агрессивного флирта',
      'естественный русский',
    ],
    avoidPatterns: [
      'политические отсылки',
      'грубость',
      'PUA-лексика',
    ],
    bannedPhrases: [
      'моя королева',
      'альфа-самец',
      'сигма',
    ],
    humorStyle: 'мягкий, без сарказма',
    formalityLevel: 'informal',
    maxEmojis: 2,
  },

  'Diaspora-EU': {
    characteristics: [
      'русский без TikTok-сленга РФ',
      'чуть более формальный register',
      'культурно нейтральный',
    ],
    avoidPatterns: [
      'региональный сленг Москвы/Питера',
      'мемы непонятные за пределами РФ',
      'кальк с английского',
    ],
    bannedPhrases: [
      'братан',
      'краш',
      'вайб чек',
      'no cap',
    ],
    humorStyle: 'универсальный, понятный в диаспоре',
    formalityLevel: 'semi-formal',
    maxEmojis: 2,
  },
};

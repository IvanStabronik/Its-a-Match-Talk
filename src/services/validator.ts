/** Observable-only language. Ban clinical / mind-reading labels in AI output. */
const BANNED_PATTERNS: RegExp[] = [
  /\bnarcissist\b/i,
  /\bnarcissism\b/i,
  /\babuser\b/i,
  /\babusive\b/i,
  /\bsociopath\b/i,
  /\bpsychopath\b/i,
  /\bborderline\b/i,
  /\bdiagnos/i,
  /\battachment style is\b/i,
  /\bavoidant on \d/i,
  /\banxious on \d/i,
  /\bон тебя не любит\b/i,
  /\bвона тебе не кохає\b/i,
  /\bon cię nie kocha\b/i,
  /\bnarcyst/i,
  /\bprzemocowy\b/i,
  /\bабьюзер\b/i,
  /\bнарцисс\b/i,
  /\bизбегающ\w+ на \d/i,
  /\bтревожн\w+ на \d/i,
];

export function containsBannedDiagnosis(text: string): boolean {
  return BANNED_PATTERNS.some((re) => re.test(text));
}

export function assertSafeInsightText(text: string): void {
  if (containsBannedDiagnosis(text)) {
    throw new Error('DIAGNOSIS_LANGUAGE_BLOCKED');
  }
}

export function scrubInsightTexts(texts: string[]): string[] {
  return texts.filter((t) => !containsBannedDiagnosis(t));
}

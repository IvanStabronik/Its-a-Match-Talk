import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type PressableProps, type TextStyle, type ViewStyle } from 'react-native';

import { COLORS } from '@/config/constants';

type ButtonProps = PressableProps & {
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost';
};

export function Button({ title, variant = 'primary', disabled, style, ...props }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style as ViewStyle,
      ]}
      {...props}
    >
      <Text style={[styles.text, variant === 'secondary' && styles.textSecondary, variant === 'ghost' && styles.textGhost]}>
        {title}
      </Text>
    </Pressable>
  );
}

type CardProps = {
  children: ReactNode;
  style?: ViewStyle;
};

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

type ScreenProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

export function Screen({ children, title, subtitle }: ScreenProps) {
  return (
    <View style={styles.screen}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

type MessageBubbleProps = {
  text: string;
  speakerLabel: string;
  isMe: boolean;
  onToggleSpeaker?: () => void;
};

export function MessageBubble({ text, speakerLabel, isMe, onToggleSpeaker }: MessageBubbleProps) {
  return (
    <Pressable onPress={onToggleSpeaker} style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
      <Text style={styles.speakerLabel}>{speakerLabel}</Text>
      <Text style={styles.bubbleText}>{text}</Text>
    </Pressable>
  );
}

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  description?: string;
};

export function Chip({ label, selected, onPress, description }: ChipProps) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{label}</Text>
      {description ? <Text style={styles.chipDescription}>{description}</Text> : null}
    </Pressable>
  );
}

type LanguagePickerProps = {
  locale: string;
  onSelect: (locale: 'ru' | 'uk' | 'pl' | 'en') => void;
  labels: Record<string, string>;
};

export function LanguagePicker({ locale, onSelect, labels }: LanguagePickerProps) {
  const locales = ['ru', 'uk', 'pl', 'en'] as const;
  return (
    <View style={styles.langRow}>
      {locales.map((code) => (
        <Pressable
          key={code}
          onPress={() => onSelect(code)}
          style={[styles.langChip, locale === code && styles.langChipSelected]}
        >
          <Text style={[styles.langChipText, locale === code && styles.langChipTextSelected]}>
            {labels[code] ?? code}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const variantStyles: Record<string, ViewStyle> = {
  primary: { backgroundColor: COLORS.primary },
  secondary: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  ghost: { backgroundColor: 'transparent' },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  text: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' } as TextStyle,
  textSecondary: { color: COLORS.text },
  textGhost: { color: COLORS.primary },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginBottom: 24,
    lineHeight: 22,
  },
  bubble: {
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    maxWidth: '92%',
  },
  bubbleMe: {
    backgroundColor: COLORS.meBubble,
    alignSelf: 'flex-end',
  },
  bubbleThem: {
    backgroundColor: COLORS.themBubble,
    alignSelf: 'flex-start',
  },
  speakerLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  bubbleText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 20,
  },
  chip: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 8,
    backgroundColor: COLORS.surface,
  },
  chipSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#EEF2FF',
  },
  chipLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  chipLabelSelected: { color: COLORS.primaryDark },
  chipDescription: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  langRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  langChipSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#EEF2FF',
  },
  langChipText: { fontSize: 13, color: COLORS.textMuted },
  langChipTextSelected: { color: COLORS.primaryDark, fontWeight: '600' },
});

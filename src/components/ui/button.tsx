import type { ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { colors, fonts, radius, shadows, sizes, spacing, typography } from "@/theme";

export type ButtonTone = "primary" | "secondary" | "danger";
export type ButtonVariant = "solid" | "tonal" | "outline" | "glass" | "text";
export type ButtonSize = "lg" | "md" | "sm";

// Icons are render functions so they can follow the button's content color.
export type ButtonIcon = (props: { color: string; size: number }) => ReactNode;

type ButtonColors = {
  background?: string;
  border?: string;
  content: string;
  shadow?: string;
};

type ButtonProps = Omit<PressableProps, "style" | "children"> & {
  title: string;
  tone?: ButtonTone;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ButtonIcon;
  rightIcon?: ButtonIcon;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const glass: ButtonColors = {
  background: colors.surfaceTranslucent,
  border: colors.hairline,
  content: colors.text,
};

const glassDisabled: ButtonColors = {
  background: colors.surfaceTranslucent,
  border: colors.textSecondary,
  content: colors.textSecondary,
};

// Source: Figma button sheet. The sheet is drawn on white, so the secondary
// (dark) tone's outline and text variants use light content on the app's dark background.
const palette: Record<ButtonTone, Record<ButtonVariant, { enabled: ButtonColors; disabled: ButtonColors }>> = {
  primary: {
    solid: {
      enabled: { background: colors.primary, content: colors.textOnPrimary, shadow: shadows.glowPrimary },
      disabled: { background: colors.primaryMuted, content: colors.primary },
    },
    outline: {
      enabled: { border: colors.primary, content: colors.primary },
      disabled: { border: colors.primaryMuted, content: colors.primaryDisabledText },
    },
    // Not on the sheet: the auth screens' submit buttons (Continue with Email, Sign up, Sign In).
    tonal: {
      enabled: { background: colors.primaryMuted, border: colors.hairline, content: colors.primary, shadow: shadows.glowPrimary },
      disabled: { background: colors.primaryTint, border: colors.hairline, content: colors.primaryDisabledText },
    },
    glass: { enabled: glass, disabled: glassDisabled },
    text: {
      enabled: { content: colors.primary },
      disabled: { content: colors.primaryDisabledText },
    },
  },
  secondary: {
    solid: {
      enabled: { background: colors.surface, content: colors.text },
      disabled: { background: colors.textSecondary, content: colors.text },
    },
    outline: {
      enabled: { border: colors.borderStrong, content: colors.text },
      disabled: { border: colors.textSecondary, content: colors.textSecondary },
    },
    tonal: {
      enabled: { background: colors.surfaceRaised, border: colors.hairline, content: colors.text },
      disabled: { background: colors.surface, border: colors.hairline, content: colors.textSecondary },
    },
    glass: { enabled: glass, disabled: glassDisabled },
    text: {
      enabled: { content: colors.text },
      disabled: { content: colors.textSecondary },
    },
  },
  // The sheet has no disabled danger state, so it falls back to the enabled
  // colors and the container is dimmed instead.
  danger: {
    solid: {
      enabled: { background: colors.danger, content: colors.textOnDanger, shadow: shadows.glowDanger },
      disabled: { background: colors.danger, content: colors.textOnDanger },
    },
    outline: {
      enabled: { border: colors.danger, content: colors.danger },
      disabled: { border: colors.danger, content: colors.danger },
    },
    tonal: {
      enabled: { background: colors.surface, border: colors.danger, content: colors.danger, shadow: shadows.glowDanger },
      disabled: { background: colors.surface, border: colors.danger, content: colors.danger },
    },
    glass: { enabled: glass, disabled: glassDisabled },
    text: {
      enabled: { content: colors.danger },
      disabled: { content: colors.danger },
    },
  },
};

// Only the large height is a style guide token; md and sm size themselves
// from vertical padding plus the line height of their text style.
const sizeStyles = {
  lg: {
    box: { height: sizes.button, paddingHorizontal: spacing.lg, borderRadius: radius.md },
    text: { fontSize: typography.button.fontSize, lineHeight: typography.button.lineHeight },
    icon: sizes.icon,
  },
  md: {
    box: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.full },
    text: { fontSize: typography.option.fontSize, lineHeight: typography.option.lineHeight },
    icon: typography.option.fontSize + spacing.xxs,
  },
  sm: {
    box: { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: radius.full },
    text: { fontSize: typography.label.fontSize, lineHeight: typography.label.lineHeight },
    icon: typography.label.fontSize + spacing.xxs,
  },
} as const;

export function getButtonColors(tone: ButtonTone, variant: ButtonVariant, disabled: boolean): ButtonColors {
  const entry = palette[tone][variant];
  return disabled ? entry.disabled : entry.enabled;
}

export function Button({
  title,
  tone = "primary",
  variant = "solid",
  size = "lg",
  leftIcon,
  rightIcon,
  disabled = false,
  style,
  textStyle,
  ...rest
}: ButtonProps) {
  const isDisabled = !!disabled;
  const tint = getButtonColors(tone, variant, isDisabled);
  const metrics = sizeStyles[size];
  const isText = variant === "text";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        metrics.box,
        isText && styles.flush,
        {
          backgroundColor: tint.background ?? "transparent",
          borderColor: tint.border ?? "transparent",
          boxShadow: tint.shadow,
        },
        pressed && tone === "primary" && variant === "solid" && { backgroundColor: colors.primaryPressed },
        pressed && !(tone === "primary" && variant === "solid") && styles.pressed,
        isDisabled && tone === "danger" && styles.dimmed,
        style,
      ]}
      {...rest}
    >
      {leftIcon?.({ color: tint.content, size: metrics.icon })}
      <Text
        numberOfLines={1}
        style={[styles.title, metrics.text, { color: tint.content }, textStyle]}
      >
        {title}
      </Text>
      {rightIcon?.({ color: tint.content, size: metrics.icon })}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    borderWidth: 1,
    borderCurve: "continuous",
  },
  title: {
    fontFamily: fonts.bold,
  },
  flush: {
    paddingHorizontal: 0,
  },
  pressed: {
    opacity: 0.7,
  },
  dimmed: {
    opacity: 0.5,
  },
});

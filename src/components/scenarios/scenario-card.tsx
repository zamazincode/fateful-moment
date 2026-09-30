import { Image, type ImageSource } from "expo-image";
import { useEffect, useState } from "react";
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { AlarmClockIcon } from "@/components/icons/alarm-clock-icon";
import { AppText } from "@/components/ui/app-text";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/format-duration";
import { colors, fonts, radius, spacing, typography } from "@/theme";

export const SCENARIO_CARD_WIDTH = 220;
const SCENARIO_CARD_HEIGHT = 176;
// The Start pill is 32pt tall with 16pt side padding, a bit roomier than Button's sm size.
const START_HEIGHT = 32;
export const DIMMED_OPACITY = 0.35;
export const DIM_DURATION_MS = 250;

// The cover fades into the background so the text on it stays readable.
// Stops fitted by comparing the design screenshot with the cover image:
// 25% at the top, half way at 30%, nearly opaque from 45% down.
const COVER_SCRIM = `linear-gradient(to bottom, ${colors.background}40 0%, ${colors.background}80 30%, ${colors.background}F2 45%, ${colors.background} 100%)`;

type ScenarioCardProps = {
  title: string;
  summary: string;
  // Length of the scenario in seconds.
  duration: number;
  cover: ImageSource | number;
  dimmed?: boolean;
  onStart?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function ScenarioCard({ title, summary, duration, cover, dimmed = false, onStart, style }: ScenarioCardProps) {
  const [opacity] = useState(() => new Animated.Value(dimmed ? DIMMED_OPACITY : 1));

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: dimmed ? DIMMED_OPACITY : 1,
      duration: DIM_DURATION_MS,
      useNativeDriver: true,
    }).start();
  }, [dimmed, opacity]);

  return (
    <Animated.View testID="scenario-card" style={[styles.card, { opacity }, style]}>
      <Image source={cover} contentFit="cover" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, styles.scrim]} />

      <View style={styles.content}>
        <View style={styles.meta}>
          <AlarmClockIcon />
          <AppText variant="caption" color="primary" style={styles.duration}>
            {formatDuration(duration)}
          </AppText>
        </View>
        <AppText numberOfLines={1} style={styles.title}>
          {title}
        </AppText>
        <AppText numberOfLines={4} style={styles.summary}>
          {summary}
        </AppText>
      </View>

      <Button
        title="Start"
        variant="tonal"
        size="sm"
        accessibilityLabel={`Start ${title}`}
        onPress={onStart}
        style={styles.start}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: SCENARIO_CARD_WIDTH,
    height: SCENARIO_CARD_HEIGHT,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    justifyContent: "space-between",
    borderRadius: radius.lg,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    overflow: "hidden",
  },
  scrim: {
    experimental_backgroundImage: COVER_SCRIM,
  },
  content: {
    gap: spacing.xxs,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
  },
  duration: {
    textTransform: "none",
  },
  title: {
    fontFamily: fonts.blackItalic,
    fontSize: typography.label.fontSize,
    lineHeight: typography.label.lineHeight,
  },
  summary: {
    fontFamily: fonts.regular,
    fontSize: typography.label.fontSize,
    lineHeight: typography.label.lineHeight,
  },
  start: {
    alignSelf: "flex-end",
    height: START_HEIGHT,
    paddingVertical: 0,
    paddingHorizontal: spacing.md,
  },
});

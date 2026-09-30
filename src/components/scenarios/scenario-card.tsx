import { Image, type ImageSource } from "expo-image";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { AlarmClockIcon } from "@/components/icons/alarm-clock-icon";
import { AppText } from "@/components/ui/app-text";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/format-duration";
import { colors, fonts, radius, spacing, typography } from "@/theme";

// Figma scenario card: 220x176 with 24pt top and 12pt side/bottom padding.
export const SCENARIO_CARD_WIDTH = 220;
const SCENARIO_CARD_HEIGHT = 176;
// The Start pill is 32pt tall with 16pt side padding, a bit roomier than Button's sm size.
const START_HEIGHT = 32;
// Cards other than the selected one fade out while a scenario is selected.
export const DIMMED_OPACITY = 0.35;

// The cover fades into the background so the text on it stays readable.
const COVER_SCRIM = `linear-gradient(to bottom, ${colors.background}4D, ${colors.background}F2)`;

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
  return (
    <View testID="scenario-card" style={[styles.card, dimmed && styles.dimmed, style]}>
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
    </View>
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
  dimmed: {
    opacity: DIMMED_OPACITY,
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
  // Title and summary share the label's 12/16 metrics in the design.
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

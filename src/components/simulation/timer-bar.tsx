import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors, gradients, radius } from "@/theme";

// Figma timer component: 4pt track with a hairline border.
const TIMER_HEIGHT = 4;

// Fill runs cyan to red across whatever is left, so the red end always
// marks where the time runs out.
const FILL_GRADIENT = `linear-gradient(to right, ${gradients.timer[0]}, ${gradients.timer[1]})`;

type TimerBarProps = {
  // Time left, 1 when full and 0 when expired.
  progress: number;
  style?: StyleProp<ViewStyle>;
};

export function TimerBar({ progress, style }: TimerBarProps) {
  const left = Math.min(Math.max(progress, 0), 1);

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Time left"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(left * 100) }}
      style={[styles.track, style]}
    >
      <View testID="timer-fill" style={[styles.fill, { width: `${left * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: TIMER_HEIGHT,
    borderRadius: radius.full,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: radius.full,
    experimental_backgroundImage: FILL_GRADIENT,
  },
});

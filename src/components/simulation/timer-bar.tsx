import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { SIMULATION_YELLOW } from "@/components/simulation/colors";
import { colors, radius } from "@/theme";

const TIMER_HEIGHT = 4;

type TimerBarProps = {
  // 1 when full, 0 when expired. Pass an Animated value to run on the native driver.
  progress: number | Animated.Value | Animated.AnimatedInterpolation<number>;
  style?: StyleProp<ViewStyle>;
};

export function TimerBar({ progress, style }: TimerBarProps) {
  const scaleX =
    typeof progress === "number"
      ? Math.min(Math.max(progress, 0), 1)
      : progress.interpolate({ inputRange: [0, 1], outputRange: [0, 1], extrapolate: "clamp" });

  return (
    <View accessible accessibilityRole="progressbar" accessibilityLabel="Time left" style={[styles.track, style]}>
      <Animated.View testID="timer-fill" style={[styles.fill, { transform: [{ scaleX }] }]} />
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
    transformOrigin: "center",
    backgroundColor: SIMULATION_YELLOW,
  },
});

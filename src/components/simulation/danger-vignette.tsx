import { Animated, StyleSheet } from "react-native";

// Stops fitted from the app screenshot: clear middle, ~13% at the edge
// midpoints (71% of the way to the corners), ~16% in the corners.
const VIGNETTE_RED = "#FF0000";
const VIGNETTE = `radial-gradient(ellipse at center, transparent 53%, ${VIGNETTE_RED}22 71%, ${VIGNETTE_RED}29 100%)`;

type DangerVignetteProps = {
  // 0 hidden, 1 at full strength.
  intensity: Animated.Value | Animated.AnimatedInterpolation<number>;
};

export function DangerVignette({ intensity }: DangerVignetteProps) {
  return (
    <Animated.View
      testID="danger-vignette"
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, styles.vignette, { opacity: intensity }]}
    />
  );
}

const styles = StyleSheet.create({
  vignette: {
    experimental_backgroundImage: VIGNETTE,
  },
});

import { Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { IconButton } from "@/components/ui/icon-button";
import { colors, radius, spacing, typography } from "@/theme";

const STEPS = 10;
const STEP_BUTTON_SIZE = 28;
const BAR_WIDTH = 6;
const BAR_HEIGHT = 16;

type VolumeControlProps = {
  // 0 to 1.
  value: number;
  onChange: (value: number) => void;
};

export function VolumeControl({ value, onChange }: VolumeControlProps) {
  const level = Math.round(value * STEPS);
  const percent = level * (100 / STEPS);

  function set(next: number) {
    const clamped = Math.min(Math.max(next, 0), STEPS);
    if (clamped !== level) onChange(clamped / STEPS);
  }

  return (
    <View style={styles.row}>
      <IconButton
        accessibilityLabel="Lower volume"
        size={STEP_BUTTON_SIZE}
        disabled={level === 0}
        onPress={() => set(level - 1)}
      >
        <AppText style={styles.sign}>−</AppText>
      </IconButton>

      <View style={styles.bars}>
        {Array.from({ length: STEPS }, (_, index) => (
          <Pressable
            key={index}
            accessibilityRole="button"
            accessibilityLabel={`Volume ${(index + 1) * (100 / STEPS)}%`}
            hitSlop={{ top: spacing.xs, bottom: spacing.xs }}
            onPress={() => set(index + 1)}
            style={[styles.bar, index < level && styles.active]}
          />
        ))}
      </View>

      <IconButton
        accessibilityLabel="Raise volume"
        size={STEP_BUTTON_SIZE}
        disabled={level === STEPS}
        onPress={() => set(level + 1)}
      >
        <AppText style={styles.sign}>+</AppText>
      </IconButton>

      <AppText variant="caption" color="textSecondary" style={styles.value}>
        {percent}%
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  sign: {
    fontSize: typography.bodySmall.fontSize,
    lineHeight: typography.bodySmall.lineHeight,
  },
  bars: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
  },
  bar: {
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
    borderRadius: radius.full,
    backgroundColor: colors.border,
  },
  active: {
    backgroundColor: colors.primaryStrong,
  },
  value: {
    minWidth: spacing.xl,
    textAlign: "right",
  },
});

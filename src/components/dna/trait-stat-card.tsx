import type { ComponentType } from "react";
import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { colors, fonts, radius, spacing, typography } from "@/theme";

const CARD_RADIUS = spacing.xs;
const ICON_SIZE = 12;
const BAR_HEIGHT = 4;

type TraitStatCardProps = {
  label: string;
  // 0 to 100.
  value: number;
  Icon: ComponentType<{ size?: number; color?: string }>;
};

export function TraitStatCard({ label, value, Icon }: TraitStatCardProps) {
  return (
    <View style={styles.card} accessible accessibilityLabel={`${label} ${value}`}>
      <View style={styles.top}>
        <Icon size={ICON_SIZE} color={colors.textMuted} />
        <AppText color="primary" style={styles.value}>
          {value}
        </AppText>
      </View>
      <AppText variant="caption" color="textMuted" numberOfLines={1} style={styles.label}>
        {label}
      </AppText>
      <View style={styles.track}>
        <View testID="trait-bar" style={[styles.bar, { width: `${value}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.xs,
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: `${colors.border}80`,
    backgroundColor: `${colors.background}99`,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  value: {
    fontFamily: fonts.blackItalic,
    fontSize: typography.label.fontSize,
    lineHeight: typography.label.lineHeight,
  },
  label: {
    marginTop: spacing.xxs,
  },
  track: {
    height: BAR_HEIGHT,
    marginTop: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: radius.full,
    backgroundColor: colors.primaryStrong,
  },
});

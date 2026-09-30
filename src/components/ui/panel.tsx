import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { colors, radius, spacing, type ColorToken } from "@/theme";

type PanelProps = {
  title: string;
  icon?: ReactNode;
  titleColor?: ColorToken;
  tone?: "default" | "danger";
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

export function Panel({
  title,
  icon,
  titleColor = "textSecondary",
  tone = "default",
  style,
  children,
}: PanelProps) {
  return (
    <View style={[styles.panel, tone === "danger" && styles.danger, style]}>
      <View style={styles.header}>
        {icon}
        <AppText variant="overline" color={titleColor}>
          {title}
        </AppText>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceTranslucent,
  },
  danger: {
    borderColor: `${colors.danger}40`,
    backgroundColor: `${colors.danger}0D`,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
});

import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { smallBodyText } from "@/components/ui/text-styles";
import { spacing, typography } from "@/theme";

type SettingRowProps = {
  label: string;
  description?: string;
  control: ReactNode;
};

export function SettingRow({ label, description, control }: SettingRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <AppText style={styles.label}>{label}</AppText>
        {description ? (
          <AppText color="textMuted" style={smallBodyText}>
            {description}
          </AppText>
        ) : null}
      </View>
      {control}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    minHeight: spacing.xxl,
  },
  text: {
    flex: 1,
    gap: spacing.xxs / 2,
  },
  label: {
    fontSize: typography.bodySmall.fontSize,
    lineHeight: typography.bodySmall.lineHeight,
  },
});

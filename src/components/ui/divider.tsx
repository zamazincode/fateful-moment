import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { colors, spacing } from "@/theme";

type DividerProps = {
  label?: string;
  style?: StyleProp<ViewStyle>;
};

export function Divider({ label, style }: DividerProps) {
  if (!label) return <View style={[styles.line, style]} />;

  return (
    <View style={[styles.row, style]}>
      <View style={styles.line} />
      <AppText variant="label" color="textMuted">{label}</AppText>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xl,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
});

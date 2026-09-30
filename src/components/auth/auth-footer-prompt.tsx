import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { fonts, spacing, typography } from "@/theme";

type AuthFooterPromptProps = {
  prompt: string;
  action: string;
  onPress: () => void;
};

export function AuthFooterPrompt({ prompt, action, onPress }: AuthFooterPromptProps) {
  return (
    <View style={styles.row}>
      <AppText color="textSecondary" style={styles.text}>
        {prompt}
      </AppText>
      <AppText
        color="primary"
        style={[styles.text, styles.action]}
        accessibilityRole="link"
        onPress={onPress}
        suppressHighlighting
      >
        {action}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "baseline",
    gap: spacing.xs,
  },
  text: {
    fontFamily: fonts.regular,
    fontSize: typography.bodySmall.fontSize,
    lineHeight: typography.bodySmall.lineHeight,
  },
  action: {
    fontFamily: fonts.bold,
    textDecorationLine: "underline",
  },
});

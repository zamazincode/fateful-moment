import { StyleSheet, View } from "react-native";

import { CheckCircleIcon } from "@/components/icons/check-circle-icon";
import { AppText } from "@/components/ui/app-text";
import { passwordRules } from "@/lib/validation/auth";
import { colors, fonts, spacing, typography } from "@/theme";

type PasswordChecklistProps = {
  password: string;
};

export function PasswordChecklist({ password }: PasswordChecklistProps) {
  return (
    <View style={styles.list}>
      {passwordRules.map((rule) => {
        const met = rule.test(password);
        return (
          <View
            key={rule.id}
            style={styles.row}
            accessible
            accessibilityLabel={`${rule.label}, ${met ? "met" : "not met"}`}
          >
            <CheckCircleIcon color={met ? colors.primary : colors.textSecondary} />
            <AppText color={met ? "text" : "textSecondary"} style={styles.label}>
              {rule.label}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.xxs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: typography.bodySmall.fontSize,
    lineHeight: typography.bodySmall.lineHeight,
  },
});

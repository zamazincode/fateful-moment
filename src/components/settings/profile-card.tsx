import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { smallBodyText } from "@/components/ui/text-styles";
import type { User } from "@/store/session";
import { colors, fonts, radius, spacing, typography } from "@/theme";

const AVATAR_SIZE = 48;

const providerNames = { apple: "Apple", google: "Google" } as const;

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] ?? "?").slice(0, 2);
  return letters.toUpperCase();
}

type ProfileCardProps = {
  user: User;
};

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <AppText color="primary" style={styles.initials}>
          {initials(user.name)}
        </AppText>
      </View>
      <View style={styles.text}>
        <AppText numberOfLines={1} style={styles.name}>
          {user.name}
        </AppText>
        <AppText color="textSecondary" numberOfLines={1} style={smallBodyText}>
          {user.email}
        </AppText>
        {user.provider ? (
          <AppText color="textMuted" style={smallBodyText}>
            Signed in with {providerNames[user.provider]}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primaryMuted,
    backgroundColor: colors.primaryTint,
  },
  initials: {
    fontFamily: fonts.bold,
    fontSize: typography.bodySmall.fontSize,
    lineHeight: typography.bodySmall.lineHeight,
  },
  text: {
    flex: 1,
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: typography.bodySmall.fontSize,
    lineHeight: typography.bodySmall.lineHeight,
  },
});

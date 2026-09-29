import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";

import { AuthButton } from "@/components/auth/auth-button";
import { AuthTitle } from "@/components/auth/auth-hero";
import { AuthLayout } from "@/components/auth/auth-layout";
import { BackButton } from "@/components/auth/back-button";
import { CheckOutlineIcon } from "@/components/icons/check-outline-icon";
import { AppText } from "@/components/ui/app-text";
import { colors, fonts, radius, spacing } from "@/theme";

const BADGE_SIZE = 80;

export default function CheckEmail() {
  const { email } = useLocalSearchParams<{ email: string }>();

  return (
    <AuthLayout>
      <View style={styles.back}>
        <BackButton />
      </View>

      <View style={styles.content}>
        <View style={styles.badge}>
          <CheckOutlineIcon />
        </View>
        <AuthTitle
          title="Check Your Email"
          subtitle={
            <>
              We&apos;ve sent password reset instructions to{" "}
              <AppText color="text" style={styles.email}>
                {email}
              </AppText>
            </>
          }
        />
      </View>

      <AuthButton
        title="Back to Sign in"
        variant="tonal"
        onPress={() => router.dismissTo("/sign-in")}
        style={styles.submit}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  // Same spot as the back button in the logo screens' hero.
  back: {
    alignSelf: "flex-start",
    marginTop: -spacing.md,
  },
  content: {
    alignItems: "center",
    gap: spacing.lg,
    marginTop: spacing.huge + spacing.xxl,
  },
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.primaryMuted,
  },
  email: {
    fontFamily: fonts.bold,
  },
  submit: {
    marginTop: spacing.xl,
  },
});

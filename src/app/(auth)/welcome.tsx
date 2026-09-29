import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import { AuthButton } from "@/components/auth/auth-button";
import { AuthHero } from "@/components/auth/auth-hero";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AppleIcon } from "@/components/icons/apple-icon";
import { GoogleIcon } from "@/components/icons/google-icon";
import { MailIcon } from "@/components/icons/mail-icon";
import { AppText } from "@/components/ui/app-text";
import { Divider } from "@/components/ui/divider";
import { useSession } from "@/store/session";
import { fonts, spacing, typography } from "@/theme";

export default function Welcome() {
  const { signInWithProvider } = useSession();

  return (
    <AuthLayout
      footer={
        <AppText color="textMuted" style={[styles.legal, styles.centered]}>
          By continuing you agree to the{" "}
          <AppText color="primaryStrong" style={styles.legal}>Terms of Use</AppText>
          {" "}and{" "}
          <AppText color="primaryStrong" style={styles.legal}>Privacy Policy</AppText>.
        </AppText>
      }
    >
      <AuthHero title="Welcome to Fateful Moment" subtitle="Sign in to continue your journey" />

      <View style={styles.actions}>
        <AuthButton
          title="Continue with Email"
          variant="tonal"
          leftIcon={({ color }) => <MailIcon color={color} />}
          onPress={() => router.push("/sign-in")}
        />
        <Divider label="OR" style={styles.divider} />
        <View style={styles.social}>
          <AuthButton
            title="Continue with Apple"
            tone="secondary"
            leftIcon={({ color }) => <AppleIcon color={color} />}
            onPress={() => signInWithProvider("apple")}
          />
          <AuthButton
            title="Continue with Google"
            tone="secondary"
            leftIcon={() => <GoogleIcon />}
            onPress={() => signInWithProvider("google")}
          />
        </View>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  actions: {
    marginTop: spacing.xxxl,
  },
  divider: {
    marginVertical: spacing.xl,
  },
  social: {
    gap: spacing.md,
  },
  centered: {
    textAlign: "center",
  },
  legal: {
    fontFamily: fonts.regular,
    fontSize: typography.bodySmall.fontSize,
    lineHeight: typography.bodySmall.lineHeight,
  },
});

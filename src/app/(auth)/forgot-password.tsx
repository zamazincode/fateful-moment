import { router } from "expo-router";
import { StyleSheet } from "react-native";

import { AuthButton } from "@/components/auth/auth-button";
import { AuthHero } from "@/components/auth/auth-hero";
import { AuthLayout } from "@/components/auth/auth-layout";
import { BackButton } from "@/components/auth/back-button";
import { MailIcon } from "@/components/icons/mail-icon";
import { TextField } from "@/components/ui/text-field";
import { useZodForm } from "@/hooks/use-zod-form";
import { resetPasswordSchema } from "@/lib/validation/auth";
import { colors, sizes, spacing } from "@/theme";

// There is no mail service: the flow only confirms the request. It succeeds
// for any valid address so it can't be used to probe for registered emails.
export default function ForgotPassword() {
  const { values, setValue, errors, isValid, data } = useZodForm(resetPasswordSchema, { email: "" });

  function submit() {
    if (!data) return;
    router.push({ pathname: "/check-email", params: { email: data.email } });
  }

  return (
    <AuthLayout>
      <AuthHero
        title="Reset your password"
        subtitle="Enter your email to receive a reset link"
        leading={<BackButton />}
      />

      <TextField
        placeholder="Your email address"
        value={values.email}
        onChangeText={(text) => setValue("email", text)}
        error={errors.email}
        leading={<MailIcon size={sizes.icon} color={colors.textMuted} />}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="send"
        onSubmitEditing={submit}
        style={styles.field}
      />

      <AuthButton
        title="Send Reset Link"
        variant="tonal"
        disabled={!isValid}
        onPress={submit}
        style={styles.submit}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  field: {
    marginTop: spacing.xl,
  },
  submit: {
    marginTop: spacing.lg,
  },
});

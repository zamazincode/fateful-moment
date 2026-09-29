import { router } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, View, type TextInput } from "react-native";

import { AuthButton } from "@/components/auth/auth-button";
import { AuthFooterPrompt } from "@/components/auth/auth-footer-prompt";
import { AuthHero } from "@/components/auth/auth-hero";
import { AuthLayout } from "@/components/auth/auth-layout";
import { BackButton } from "@/components/auth/back-button";
import { PasswordField } from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { useZodForm } from "@/hooks/use-zod-form";
import { authMessages, signInSchema } from "@/lib/validation/auth";
import { useSession } from "@/store/session";
import { fonts, spacing, typography } from "@/theme";

export default function SignIn() {
  const { signIn } = useSession();
  const { values, setValue, errors, isValid, data } = useZodForm(signInSchema, { email: "", password: "" });
  const [authError, setAuthError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  function change(key: "email" | "password", text: string) {
    setValue(key, text);
    setAuthError(undefined);
  }

  async function submit() {
    if (!data || submitting) return;
    setSubmitting(true);
    const result = await signIn(data.email, data.password);
    if (!result.ok) {
      setAuthError(result.reason === "wrong-password" ? authMessages.wrongPassword : authMessages.invalidCredentials);
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      footer={
        <AuthFooterPrompt prompt="No account yet?" action="Sign up" onPress={() => router.replace("/sign-up")} />
      }
    >
      <AuthHero title="Welcome to Fateful Moment" subtitle="Sign in with Email" leading={<BackButton />} />

      <View style={styles.form}>
        <TextField
          placeholder="Your email address"
          value={values.email}
          onChangeText={(text) => change("email", text)}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <PasswordField
          ref={passwordRef}
          placeholder="Your password"
          value={values.password}
          onChangeText={(text) => change("password", text)}
          error={authError}
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="done"
          onSubmitEditing={submit}
        />
      </View>

      <AuthButton
        title="Sign In"
        variant="tonal"
        disabled={!isValid || submitting}
        onPress={submit}
        style={styles.submit}
      />
      <Button
        title="Forgot password?"
        variant="text"
        size="md"
        textStyle={styles.forgot}
        style={styles.forgotButton}
        onPress={() => router.push("/forgot-password")}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: spacing.xl,
    gap: spacing.xl,
  },
  submit: {
    marginTop: spacing.xxxl,
  },
  forgotButton: {
    alignSelf: "center",
    marginTop: spacing.xl,
  },
  forgot: {
    fontFamily: fonts.regular,
    fontSize: typography.body.fontSize,
  },
});

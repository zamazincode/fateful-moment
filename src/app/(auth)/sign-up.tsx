import { router } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, View, type TextInput } from "react-native";

import { AuthButton } from "@/components/auth/auth-button";
import { AuthFooterPrompt } from "@/components/auth/auth-footer-prompt";
import { AuthHero } from "@/components/auth/auth-hero";
import { AuthLayout } from "@/components/auth/auth-layout";
import { BackButton } from "@/components/auth/back-button";
import { PasswordChecklist } from "@/components/auth/password-checklist";
import { PasswordField } from "@/components/auth/password-field";
import { TextField } from "@/components/ui/text-field";
import { useZodForm } from "@/hooks/use-zod-form";
import { authMessages, signUpSchema } from "@/lib/validation/auth";
import { useSession } from "@/store/session";
import { spacing } from "@/theme";

export default function SignUp() {
  const { signUp } = useSession();
  const { values, setValue, errors, isValid, data } = useZodForm(signUpSchema, {
    name: "",
    email: "",
    password: "",
  });
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  // Rules stay visible while typing, and after blur until they all pass.
  const showChecklist = passwordFocused || (values.password !== "" && !!errors.password);

  async function submit() {
    if (!data || submitting) return;
    setSubmitting(true);
    const result = await signUp(data.name, data.email, data.password);
    // On success the protected stack swaps to the app, so there's nothing to reset.
    if (!result.ok) {
      setEmailTaken(true);
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      footer={
        <AuthFooterPrompt
          prompt="Already have an account?"
          action="Sign in"
          onPress={() => router.replace("/sign-in")}
        />
      }
    >
      <AuthHero title="Create your Fateful Moment Account" leading={<BackButton />} />

      <View style={styles.form}>
        <TextField
          placeholder="Full Name"
          value={values.name}
          onChangeText={(text) => setValue("name", text)}
          error={errors.name}
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => emailRef.current?.focus()}
        />
        <TextField
          ref={emailRef}
          placeholder="Your email address"
          value={values.email}
          onChangeText={(text) => {
            setValue("email", text);
            setEmailTaken(false);
          }}
          error={errors.email ?? (emailTaken ? authMessages.emailTaken : undefined)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <View style={styles.passwordGroup}>
          <PasswordField
            ref={passwordRef}
            placeholder="Your password"
            value={values.password}
            onChangeText={(text) => setValue("password", text)}
            invalid={!passwordFocused && values.password !== "" && !!errors.password}
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="done"
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            onSubmitEditing={submit}
          />
          {showChecklist ? <PasswordChecklist password={values.password} /> : null}
        </View>
      </View>

      <AuthButton
        title="Sign up"
        variant="tonal"
        disabled={!isValid || submitting}
        onPress={submit}
        style={styles.submit}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: spacing.xl,
    gap: spacing.xl,
  },
  passwordGroup: {
    gap: spacing.md,
  },
  submit: {
    marginTop: spacing.xxxl,
  },
});

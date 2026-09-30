import { router } from "expo-router";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, View, type TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PasswordChecklist } from "@/components/auth/password-checklist";
import { PasswordField } from "@/components/auth/password-field";
import { BackArrowButton } from "@/components/navigation/back-arrow-button";
import { Button } from "@/components/ui/button";
import { ScreenTitle } from "@/components/ui/screen-title";
import { useZodForm } from "@/hooks/use-zod-form";
import { authMessages, changePasswordSchema } from "@/lib/validation/auth";
import { useSession } from "@/store/session";
import { colors, spacing } from "@/theme";

// Keeps the form readable on wide landscape screens.
const FORM_MAX_WIDTH = 420;

export default function ChangePassword() {
  const insets = useSafeAreaInsets();
  const { changePassword } = useSession();
  const { values, setValue, errors, isValid, data } = useZodForm(changePasswordSchema, {
    currentPassword: "",
    newPassword: "",
  });
  const [newFocused, setNewFocused] = useState(false);
  const [wrongCurrent, setWrongCurrent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const newRef = useRef<TextInput>(null);

  const showChecklist = newFocused || (values.newPassword !== "" && !!errors.newPassword);

  async function submit() {
    if (!data || submitting) return;
    setSubmitting(true);
    const result = await changePassword(data.currentPassword, data.newPassword);
    if (result.ok) {
      router.back();
      return;
    }
    setWrongCurrent(true);
    setSubmitting(false);
  }

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView behavior="padding" style={styles.screen}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.content,
            {
              paddingLeft: insets.left + spacing.lg,
              paddingRight: insets.right + spacing.lg,
              paddingBottom: insets.bottom + spacing.lg,
            },
          ]}
        >
          <View style={styles.header}>
            <BackArrowButton />
            <ScreenTitle>Change Password</ScreenTitle>
          </View>

          <View style={styles.form}>
            <PasswordField
              placeholder="Current password"
              value={values.currentPassword}
              onChangeText={(text) => {
                setValue("currentPassword", text);
                setWrongCurrent(false);
              }}
              error={wrongCurrent ? authMessages.wrongCurrentPassword : undefined}
              autoComplete="current-password"
              textContentType="password"
              returnKeyType="next"
              submitBehavior="submit"
              onSubmitEditing={() => newRef.current?.focus()}
            />
            <View style={styles.group}>
              <PasswordField
                ref={newRef}
                placeholder="New password"
                value={values.newPassword}
                onChangeText={(text) => setValue("newPassword", text)}
                invalid={!newFocused && values.newPassword !== "" && !!errors.newPassword}
                error={
                  values.newPassword !== "" && values.newPassword === values.currentPassword
                    ? errors.newPassword
                    : undefined
                }
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="done"
                onFocus={() => setNewFocused(true)}
                onBlur={() => setNewFocused(false)}
                onSubmitEditing={submit}
              />
              {showChecklist ? <PasswordChecklist password={values.newPassword} /> : null}
            </View>

            <Button
              title="Save Password"
              variant="tonal"
              disabled={!isValid || submitting}
              onPress={submit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: spacing.md,
    gap: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  form: {
    width: "100%",
    maxWidth: FORM_MAX_WIDTH,
    alignSelf: "center",
    gap: spacing.md,
  },
  group: {
    gap: spacing.sm,
  },
});

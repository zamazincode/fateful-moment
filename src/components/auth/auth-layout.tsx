import type { ReactNode } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from "react-native";

import { Screen } from "@/components/ui/screen";
import { spacing } from "@/theme";

type AuthLayoutProps = {
  children: ReactNode;
  footer?: ReactNode;
};

// Portrait auth scaffold: the content scrolls above the keyboard and the
// footer stays pinned to the bottom when there is room.
export function AuthLayout({ children, footer }: AuthLayoutProps) {
  return (
    <Screen padded={false}>
      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          {children}
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  footer: {
    marginTop: "auto",
    paddingTop: spacing.xl,
  },
});

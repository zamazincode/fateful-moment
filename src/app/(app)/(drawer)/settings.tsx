import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MenuButton } from "@/components/navigation/menu-button";
import { AppText } from "@/components/ui/app-text";
import { Button } from "@/components/ui/button";
import { useSession } from "@/store/session";
import { colors, spacing } from "@/theme";

// Temporary until Settings is designed; for now it is where you sign out.
export default function Settings() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useSession();

  return (
    <View style={styles.screen}>
      <MenuButton style={{ marginLeft: insets.left + spacing.xs, marginTop: spacing.xxs }} />
      <View style={[styles.body, { paddingLeft: insets.left + spacing.lg }]}>
        <AppText variant="heading3">Settings</AppText>
        <AppText color="textSecondary">Signed in as {user?.email}</AppText>
        <Button title="Sign out" tone="danger" variant="outline" size="md" onPress={signOut} style={styles.signOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.md,
  },
  signOut: {
    alignSelf: "flex-start",
  },
});

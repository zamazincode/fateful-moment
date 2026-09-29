import { Pressable, StyleSheet } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Screen } from "@/components/ui/screen";
import { useSession } from "@/store/session";
import { spacing } from "@/theme";

// Placeholder until the home screenshot is implemented.
export default function Home() {
  const { user, signOut } = useSession();

  return (
    <Screen style={styles.container}>
      <AppText variant="heading2">Hello, {user?.name}</AppText>
      <Pressable onPress={signOut}>
        <AppText variant="button" color="danger">Sign out</AppText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    gap: spacing.lg,
  },
});

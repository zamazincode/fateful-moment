import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MenuButton } from "@/components/navigation/menu-button";
import { AppText } from "@/components/ui/app-text";
import { colors, spacing } from "@/theme";

// Placeholder until the static Decision DNA page is built from its screenshot.
export default function DecisionDna() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <MenuButton style={{ marginLeft: insets.left + spacing.xs, marginTop: spacing.xxs }} />
      <View style={[styles.body, { paddingLeft: insets.left + spacing.lg }]}>
        <AppText variant="heading3">Decision DNA</AppText>
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
  },
});

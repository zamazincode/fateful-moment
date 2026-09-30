import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MenuButton } from "@/components/navigation/menu-button";
import { MusicPlayer, PLAYER_HEIGHT } from "@/components/player/music-player";
import { AppText } from "@/components/ui/app-text";
import { colors, spacing } from "@/theme";

// Scenarios: only the header (menu + music player) so far; the title and the
// scenario list come with the next step.
export default function Scenarios() {
  const insets = useSafeAreaInsets();
  const gutter = insets.left + spacing.lg;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <MenuButton style={{ marginLeft: insets.left + spacing.xs }} />
        {/* Hairline under the header, from the content edge to the right edge. */}
        <View style={[styles.divider, { left: gutter }]} />
        <MusicPlayer style={styles.player} />
      </View>

      <View style={[styles.body, { paddingLeft: gutter }]}>
        <AppText variant="heading3">Scenarios</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: PLAYER_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // The track list drops below the header over the content.
    zIndex: 1,
  },
  divider: {
    position: "absolute",
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderStrong,
  },
  player: {
    alignSelf: "flex-start",
  },
  body: {
    flex: 1,
    justifyContent: "center",
  },
});

import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MusicPlayer, PLAYER_HEIGHT } from "@/components/player/music-player";
import { colors, spacing } from "@/theme";

type AppHeaderProps = {
  left: ReactNode;
};

export function AppHeader({ left }: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.header}>
      <View style={styles.divider} />
      <View style={{ marginLeft: insets.left + spacing.xs }}>{left}</View>
      <MusicPlayer style={styles.player} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: PLAYER_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // The player's track list drops below the header over the content.
    zIndex: 1,
  },
  divider: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderStrong,
  },
  player: {
    alignSelf: "flex-start",
  },
});

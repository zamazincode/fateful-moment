import { useState } from "react";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { NextTrackIcon } from "@/components/icons/next-track-icon";
import { PauseIcon } from "@/components/icons/pause-icon";
import { PlayIcon } from "@/components/icons/play-icon";
import { PlaylistIcon } from "@/components/icons/playlist-icon";
import { PreviousTrackIcon } from "@/components/icons/previous-track-icon";
import { AppText } from "@/components/ui/app-text";
import { TrackList } from "@/components/player/track-list";
import { useMusicPlayer } from "@/store/music-player";
import { colors, fonts, radius, shadows, spacing, typography } from "@/theme";

// Figma music player: a 48pt pill hanging from the top right corner, 288pt
// wide plus the right safe area, which it extends into.
export const PLAYER_HEIGHT = 48;
const PLAYER_WIDTH = 288;
// Controls sit in 32pt boxes; play is a glowing ring of the same size.
const CONTROL_SIZE = 32;
// Measured: surface at 80%, and the play ring's cyan at 12% fill / 50% border.
const PLAYER_BACKGROUND = `${colors.surface}CC`;
const PLAY_FILL = `${colors.primaryStrong}1F`;
const PLAY_BORDER = `${colors.primaryStrong}80`;

type MusicPlayerProps = {
  style?: StyleProp<ViewStyle>;
};

export function MusicPlayer({ style }: MusicPlayerProps) {
  const player = useMusicPlayer();
  const insets = useSafeAreaInsets();
  const [listOpen, setListOpen] = useState(false);

  return (
    <View style={style}>
      <View
        testID="music-player"
        style={[styles.pill, { width: PLAYER_WIDTH + insets.right, paddingRight: spacing.sm + insets.right }]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous track"
          hitSlop={4}
          onPress={player.previous}
          style={({ pressed }) => [styles.control, pressed && styles.pressed]}
        >
          <PreviousTrackIcon />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={player.playing ? "Pause" : "Play"}
          onPress={player.toggle}
          style={({ pressed }) => [styles.control, styles.play, pressed && styles.pressed]}
        >
          {player.playing ? <PauseIcon /> : <PlayIcon />}
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next track"
          hitSlop={4}
          onPress={player.next}
          style={({ pressed }) => [styles.control, pressed && styles.pressed]}
        >
          <NextTrackIcon />
        </Pressable>

        <View style={styles.nowPlaying}>
          <AppText variant="caption" color="primaryDisabledText">
            {player.playing ? "Now Playing" : "Standby"}
          </AppText>
          <AppText numberOfLines={1} style={styles.title}>
            {player.track.title}
          </AppText>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Playlist"
          accessibilityState={{ expanded: listOpen }}
          hitSlop={4}
          onPress={() => setListOpen((open) => !open)}
          style={({ pressed }) => [styles.control, pressed && styles.pressed]}
        >
          <PlaylistIcon color={listOpen ? colors.primary : colors.textMuted} />
        </Pressable>
      </View>

      {listOpen ? (
        <TrackList
          tracks={player.tracks}
          current={player.track.id}
          onSelect={(index) => {
            player.select(index);
            setListOpen(false);
          }}
          style={[styles.list, { right: spacing.sm + insets.right }]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: PLAYER_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingLeft: spacing.xs,
    borderTopLeftRadius: PLAYER_HEIGHT / 2,
    borderBottomLeftRadius: PLAYER_HEIGHT / 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderRightWidth: 0,
    borderColor: colors.border,
    backgroundColor: PLAYER_BACKGROUND,
    boxShadow: shadows.elevated,
  },
  control: {
    width: CONTROL_SIZE,
    height: CONTROL_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  play: {
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: PLAY_BORDER,
    backgroundColor: PLAY_FILL,
    boxShadow: shadows.glowPrimary,
  },
  pressed: {
    opacity: 0.7,
  },
  nowPlaying: {
    flex: 1,
  },
  // Track titles are bold caps at the caption size in the design.
  title: {
    fontFamily: fonts.bold,
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    textTransform: "uppercase",
  },
  list: {
    position: "absolute",
    top: PLAYER_HEIGHT + spacing.xs,
  },
});

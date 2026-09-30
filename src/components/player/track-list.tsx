import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { AppText } from "@/components/ui/app-text";
import type { Track } from "@/data/tracks";
import { colors, radius, shadows, spacing } from "@/theme";

// Not in the design: a plain dropdown under the player, built from the
// menu item tokens (tinted row for the current track).
const LIST_WIDTH = 240;
const CURRENT_FILL = `${colors.primaryStrong}1A`;

type TrackListProps = {
  tracks: Track[];
  current: string;
  onSelect: (index: number) => void;
  style?: StyleProp<ViewStyle>;
};

export function TrackList({ tracks, current, onSelect, style }: TrackListProps) {
  return (
    <View testID="track-list" accessibilityRole="list" style={[styles.list, style]}>
      {tracks.map((track, index) => {
        const isCurrent = track.id === current;
        return (
          <Pressable
            key={track.id}
            accessibilityRole="button"
            accessibilityLabel={`${track.title} by ${track.artist}`}
            accessibilityState={{ selected: isCurrent }}
            onPress={() => onSelect(index)}
            style={({ pressed }) => [styles.row, isCurrent && styles.current, pressed && styles.pressed]}
          >
            <AppText variant="label" color={isCurrent ? "primary" : "text"} numberOfLines={1}>
              {track.title}
            </AppText>
            <AppText variant="caption" color="textMuted" numberOfLines={1}>
              {track.artist}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    width: LIST_WIDTH,
    padding: spacing.xxs,
    gap: spacing.xxs,
    borderRadius: radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    boxShadow: shadows.elevated,
  },
  row: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    gap: spacing.xxs,
    borderRadius: radius.md - spacing.xxs,
  },
  current: {
    backgroundColor: CURRENT_FILL,
  },
  pressed: {
    opacity: 0.7,
  },
});

import { Pressable, StyleSheet, View } from "react-native";

import { CheckOutlineIcon } from "@/components/icons/check-outline-icon";
import { AppText } from "@/components/ui/app-text";
import { smallBodyText } from "@/components/ui/text-styles";
import type { Track } from "@/data/tracks";
import { colors, radius, spacing, typography } from "@/theme";

const CHECK_SIZE = 16;

type TrackPickerProps = {
  tracks: Track[];
  selectedId: string;
  onSelect: (index: number) => void;
};

export function TrackPicker({ tracks, selectedId, onSelect }: TrackPickerProps) {
  return (
    <View style={styles.list}>
      {tracks.map((track, index) => {
        const selected = track.id === selectedId;
        return (
          <Pressable
            key={track.id}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={`${track.title} by ${track.artist}`}
            onPress={() => onSelect(index)}
            style={({ pressed }) => [styles.row, selected && styles.selected, pressed && styles.pressed]}
          >
            <View style={styles.text}>
              <AppText color={selected ? "primary" : "text"} numberOfLines={1} style={styles.title}>
                {track.title}
              </AppText>
              <AppText color="textMuted" numberOfLines={1} style={smallBodyText}>
                {track.artist}
              </AppText>
            </View>
            {selected ? <CheckOutlineIcon size={CHECK_SIZE} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: {
    borderColor: colors.primaryMuted,
    backgroundColor: colors.primaryTint,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    flex: 1,
  },
  title: {
    fontSize: typography.bodySmall.fontSize,
    lineHeight: typography.bodySmall.lineHeight,
  },
});

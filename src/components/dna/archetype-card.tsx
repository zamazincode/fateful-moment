import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { smallBodyText } from "@/components/ui/text-styles";
import type { Archetype } from "@/data/decision-dna";
import { colors, radius, spacing } from "@/theme";

const AVATAR_SIZE = 80;
// The avatar WebPs are cropped for a 14/64 corner radius; a rounder corner would show their clipped edges.
const AVATAR_RADIUS = (AVATAR_SIZE * 14) / 64;

type ArchetypeCardProps = {
  archetype: Archetype;
  quote: string;
};

export function ArchetypeCard({ archetype, quote }: ArchetypeCardProps) {
  return (
    <View style={styles.card}>
      <Image
        source={archetype.avatar}
        style={styles.avatar}
        contentFit="cover"
        accessibilityLabel={`${archetype.title} avatar`}
      />
      <View style={styles.body}>
        <AppText variant="heading3" accessibilityRole="header">
          {archetype.title}
        </AppText>
        <View style={styles.quote}>
          <AppText color="textSecondary" style={styles.quoteText}>
            &quot;{quote}&quot;
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceTranslucent,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_RADIUS,
  },
  body: {
    flex: 1,
    gap: spacing.xs,
  },
  quote: {
    borderLeftWidth: 1,
    borderLeftColor: `${colors.primaryStrong}66`,
    paddingLeft: spacing.xs,
  },
  quoteText: smallBodyText,
});

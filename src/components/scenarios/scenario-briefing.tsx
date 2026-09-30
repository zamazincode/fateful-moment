import { Image, type ImageSource } from "expo-image";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { Button } from "@/components/ui/button";
import { colors, fonts, spacing, typography } from "@/theme";

// Figma scenario briefing container: 24pt corners, content centered on the cover.
const BRIEFING_RADIUS = 24;
// Wide enough for two lines of the design's placeholder text.
const DESCRIPTION_MAX_WIDTH = 496;
// Description is the text color at 85% (measured), softer than the title.
const DESCRIPTION_OPACITY = 0.85;
// Start Simulation keeps the large button's text and radius but hugs its
// label: 12pt padding above and below the 24pt line instead of the 58pt height.
const START_HEIGHT = spacing.sm * 2 + typography.button.lineHeight;

const COVER_SCRIM = `linear-gradient(to bottom, ${colors.background}59, ${colors.background})`;

type ScenarioBriefingProps = {
  title: string;
  description: string;
  cover: ImageSource | number;
  onStart?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function ScenarioBriefing({ title, description, cover, onStart, style }: ScenarioBriefingProps) {
  return (
    <View testID="scenario-briefing" style={[styles.container, style]}>
      <Image source={cover} contentFit="cover" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, styles.scrim]} />

      <AppText variant="hud" color="primary">
        Scenario Briefing
      </AppText>
      <AppText variant="heading2" numberOfLines={2} style={styles.title}>
        {title}
      </AppText>
      <AppText style={styles.description}>{description}</AppText>

      <Button title="Start Simulation" variant="tonal" onPress={onStart} style={styles.start} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    borderRadius: BRIEFING_RADIUS,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    overflow: "hidden",
  },
  scrim: {
    experimental_backgroundImage: COVER_SCRIM,
  },
  title: {
    marginTop: spacing.xxs,
    textAlign: "center",
  },
  description: {
    maxWidth: DESCRIPTION_MAX_WIDTH,
    marginTop: spacing.md,
    fontFamily: fonts.regular,
    fontSize: typography.bodySmall.fontSize,
    lineHeight: typography.bodySmall.lineHeight,
    textAlign: "center",
    opacity: DESCRIPTION_OPACITY,
  },
  start: {
    height: START_HEIGHT,
    marginTop: spacing.lg,
  },
});

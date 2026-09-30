import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ArchetypeCard } from "@/components/dna/archetype-card";
import { BlindSpotCard } from "@/components/dna/blind-spot-card";
import { PatternDetection } from "@/components/dna/pattern-detection";
import { PsychologicalMatrix } from "@/components/dna/psychological-matrix";
import { AppHeader } from "@/components/navigation/app-header";
import { MenuButton } from "@/components/navigation/menu-button";
import { ScreenTitle } from "@/components/ui/screen-title";
import { archetypes, decisionDna } from "@/data/decision-dna";
import { lowestTrait } from "@/lib/decision-dna";
import { colors, spacing } from "@/theme";

export default function DecisionDna() {
  const insets = useSafeAreaInsets();
  const { archetype, quote, scores, patterns, blindSpot } = decisionDna;
  const blindSpotTrait = lowestTrait(scores);

  return (
    <View style={styles.screen}>
      <AppHeader left={<MenuButton />} />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingLeft: insets.left + spacing.lg,
            paddingRight: insets.right + spacing.lg,
            paddingBottom: insets.bottom + spacing.lg,
          },
        ]}
      >
        <ScreenTitle>Decision DNA</ScreenTitle>

        <View style={styles.columns}>
          <View style={[styles.column, styles.wide]}>
            <ArchetypeCard archetype={archetypes[archetype]} quote={quote} />
            <PsychologicalMatrix scores={scores} style={styles.fill} />
          </View>
          <View style={styles.column}>
            <PatternDetection patterns={patterns} />
            <BlindSpotCard
              trait={blindSpotTrait.label}
              question={blindSpot.question}
              description={blindSpot.description}
              style={styles.fill}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  columns: {
    flexDirection: "row",
    gap: spacing.md,
  },
  column: {
    flex: 1,
    gap: spacing.md,
  },
  // Wider so the radar keeps its size beside the stat grid.
  wide: {
    flex: 1.25,
  },
  fill: {
    flex: 1,
  },
});

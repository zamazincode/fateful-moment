import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppHeader } from "@/components/navigation/app-header";
import { MenuButton } from "@/components/navigation/menu-button";
import { ScenarioList } from "@/components/scenarios/scenario-list";
import { AppText } from "@/components/ui/app-text";
import { scenarios } from "@/data/scenarios";
import { colors, fonts, spacing, typography } from "@/theme";

export default function Scenarios() {
  const insets = useSafeAreaInsets();
  const gutter = insets.left + spacing.lg;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <View style={styles.screen}>
      <AppHeader left={<MenuButton />} />

      <View style={[styles.intro, { paddingLeft: gutter, paddingRight: insets.right + spacing.lg }]}>
        <AppText style={styles.title}>Scenarios</AppText>
        <AppText variant="overline" color="primary" style={styles.subtitle}>
          Choose A Scenario And Ask Yourself, &quot;If You Were In That Situation, What Would You Do?&quot;
        </AppText>
        <AppText variant="label" color="textMuted" style={styles.count}>
          {scenarios.length} Scenarios
        </AppText>
      </View>

      <View>
        <ScenarioList
          scenarios={scenarios}
          selectedId={selectedId}
          onStart={(scenario) => setSelectedId(scenario.id)}
          inset={gutter}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  intro: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  // Plain bold at the heading3 size: the design's page title isn't italic caps.
  title: {
    fontFamily: fonts.bold,
    fontSize: typography.heading3.fontSize,
    lineHeight: typography.heading3.lineHeight,
  },
  // Bold mono in the design. The mono family is a system font, so a weight is safe here.
  subtitle: {
    marginTop: spacing.xxs,
    fontWeight: "700",
    letterSpacing: 0,
    textTransform: "none",
  },
  count: {
    marginTop: spacing.sm,
    textTransform: "none",
  },
});

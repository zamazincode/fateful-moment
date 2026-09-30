import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppHeader } from "@/components/navigation/app-header";
import { MenuButton } from "@/components/navigation/menu-button";
import { DIM_DURATION_MS } from "@/components/scenarios/scenario-card";
import { ScenarioList } from "@/components/scenarios/scenario-list";
import { AppText } from "@/components/ui/app-text";
import { ScreenTitle } from "@/components/ui/screen-title";
import { scenarios } from "@/data/scenarios";
import { colors, spacing } from "@/theme";

export default function Scenarios() {
  const insets = useSafeAreaInsets();
  const gutter = insets.left + spacing.lg;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useFocusEffect(useCallback(() => setSelectedId(null), []));

  function start(id: string) {
    if (selectedId) return;
    setSelectedId(id);
    // Let the other cards fade before the briefing slides in.
    setTimeout(() => router.push({ pathname: "/scenario/[id]", params: { id } }), DIM_DURATION_MS);
  }

  return (
    <View style={styles.screen}>
      <AppHeader left={<MenuButton />} />

      <View style={[styles.intro, { paddingLeft: gutter, paddingRight: insets.right + spacing.lg }]}>
        <ScreenTitle>Scenarios</ScreenTitle>
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
          onStart={(scenario) => start(scenario.id)}
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

import { FlatList, StyleSheet } from "react-native";

import { ScenarioCard } from "@/components/scenarios/scenario-card";
import type { Scenario } from "@/data/scenarios";
import { spacing } from "@/theme";

type ScenarioListProps = {
  scenarios: Scenario[];
  selectedId?: string | null;
  onStart: (scenario: Scenario) => void;
  // Left inset so the first card lines up with the titles above.
  inset: number;
};

export function ScenarioList({ scenarios, selectedId, onStart, inset }: ScenarioListProps) {
  return (
    <FlatList
      horizontal
      data={scenarios}
      keyExtractor={(scenario) => scenario.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.content, { paddingLeft: inset, paddingRight: inset }]}
      renderItem={({ item }) => (
        <ScenarioCard
          title={item.title}
          summary={item.summary}
          duration={item.duration}
          cover={item.media.cover}
          dimmed={!!selectedId && selectedId !== item.id}
          onStart={() => onStart(item)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
});

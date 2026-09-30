import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { OPTION_MAX_WIDTH, OptionCard, type OptionState } from "@/components/simulation/option-card";
import { spacing } from "@/theme";

const GAP = spacing.sm;

type OptionGridProps = {
  options: string[];
  stateOf: (index: number) => OptionState;
  yourChoice?: number | null;
  disabled?: boolean;
  onPick: (index: number) => void;
};

// Card width comes from the measured grid width: RN has no calc() for
// "half minus the gap".
export function OptionGrid({ options, stateOf, yourChoice = null, disabled = false, onPick }: OptionGridProps) {
  const [width, setWidth] = useState(0);
  const cardWidth = Math.min(OPTION_MAX_WIDTH, (width - GAP) / 2);

  return (
    <View testID="option-grid" style={styles.grid} onLayout={({ nativeEvent }) => setWidth(nativeEvent.layout.width)}>
      {width > 0
        ? options.map((label, index) => (
            <OptionCard
              key={index}
              label={label}
              state={stateOf(index)}
              yourChoice={index === yourChoice}
              disabled={disabled}
              onPress={() => onPick(index)}
              style={{ width: cardWidth }}
            />
          ))
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: GAP,
  },
});

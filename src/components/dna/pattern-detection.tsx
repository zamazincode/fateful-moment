import { StyleSheet, View } from "react-native";

import { DnaPanel } from "@/components/dna/dna-panel";
import { dnaBodyText } from "@/components/dna/dna-text";
import { ActivityIcon } from "@/components/icons/activity-icon";
import { AppText } from "@/components/ui/app-text";
import { fonts, sizes, spacing, typography } from "@/theme";

type PatternDetectionProps = {
  patterns: string[];
};

export function PatternDetection({ patterns }: PatternDetectionProps) {
  return (
    <DnaPanel title="Pattern Detection" icon={<ActivityIcon size={sizes.icon} />}>
      <View style={styles.list}>
        {patterns.map((pattern, index) => (
          <View key={pattern} style={styles.row}>
            <AppText color="primaryStrong" style={styles.number}>
              {String(index + 1).padStart(2, "0")}
            </AppText>
            <AppText color="textMuted" style={styles.text}>
              {pattern}
            </AppText>
          </View>
        ))}
      </View>
    </DnaPanel>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xs,
  },
  // Bold mono in the design. The mono family is a system font, so a weight is safe here.
  // The taller line box sits the digits on the first text line's baseline.
  number: {
    fontFamily: fonts.mono,
    fontWeight: "700",
    fontSize: typography.body.fontSize,
    lineHeight: typography.label.lineHeight + 3,
  },
  text: {
    ...dnaBodyText,
    flex: 1,
  },
});

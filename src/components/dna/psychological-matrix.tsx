import type { ComponentType } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { DnaPanel } from "@/components/dna/dna-panel";
import { RadarChart } from "@/components/dna/radar-chart";
import { TraitStatCard } from "@/components/dna/trait-stat-card";
import { AlertTriangleIcon } from "@/components/icons/alert-triangle-icon";
import { CogIcon } from "@/components/icons/cog-icon";
import { DnaIcon } from "@/components/icons/dna-icon";
import { EyeIcon } from "@/components/icons/eye-icon";
import { HeartIcon } from "@/components/icons/heart-icon";
import { ScaleIcon } from "@/components/icons/scale-icon";
import { ZapIcon } from "@/components/icons/zap-icon";
import { traits, type TraitId } from "@/data/decision-dna";
import { colors, sizes, spacing } from "@/theme";

const STAT_CARD_WIDTH = 68;
const BRACKET_SIZE = 32;

const traitIcons: Record<TraitId, ComponentType<{ size?: number; color?: string }>> = {
  vision: EyeIcon,
  courage: ZapIcon,
  risk: AlertTriangleIcon,
  control: CogIcon,
  empathy: HeartIcon,
  ethics: ScaleIcon,
};

type PsychologicalMatrixProps = {
  scores: Record<TraitId, number>;
  style?: StyleProp<ViewStyle>;
};

export function PsychologicalMatrix({ scores, style }: PsychologicalMatrixProps) {
  return (
    <DnaPanel
      title="Psychological Matrix"
      titleColor="text"
      icon={<DnaIcon size={sizes.icon} color={colors.primary} />}
      style={[styles.panel, style]}
    >
      <View style={styles.content}>
        <View pointerEvents="none" style={[styles.bracket, styles.bracketTopRight]} />
        <View pointerEvents="none" style={[styles.bracket, styles.bracketBottomLeft]} />

        <RadarChart axes={traits.map((trait) => ({ label: trait.label, value: scores[trait.id] }))} />

        <View style={styles.grid}>
          {traits.map((trait) => (
            <View key={trait.id} style={styles.cell}>
              <TraitStatCard label={trait.label} value={scores[trait.id]} Icon={traitIcons[trait.id]} />
            </View>
          ))}
        </View>
      </View>
    </DnaPanel>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: `${colors.surface}A1`,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xxs,
  },
  bracket: {
    position: "absolute",
    width: BRACKET_SIZE,
    height: BRACKET_SIZE,
    borderColor: colors.border,
  },
  bracketTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderTopRightRadius: spacing.xs,
  },
  bracketBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderBottomLeftRadius: spacing.xs,
  },
  grid: {
    width: 2 * STAT_CARD_WIDTH + spacing.xs,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  cell: {
    width: STAT_CARD_WIDTH,
  },
});

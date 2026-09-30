import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { DnaPanel } from "@/components/dna/dna-panel";
import { dnaBodyText } from "@/components/dna/dna-text";
import { TargetIcon } from "@/components/icons/target-icon";
import { AppText } from "@/components/ui/app-text";
import { sizes, spacing } from "@/theme";

type BlindSpotCardProps = {
  trait: string;
  question: string;
  description: string;
  style?: StyleProp<ViewStyle>;
};

export function BlindSpotCard({ trait, question, description, style }: BlindSpotCardProps) {
  return (
    <DnaPanel
      title={`Blind Spot – ${trait}`}
      titleColor="danger"
      tone="danger"
      icon={<TargetIcon size={sizes.icon} />}
      style={style}
    >
      <AppText style={styles.text}>{question}</AppText>
      <AppText color="textSecondary" style={[styles.text, styles.description]}>
        {description}
      </AppText>
    </DnaPanel>
  );
}

const styles = StyleSheet.create({
  text: dnaBodyText,
  description: {
    marginTop: spacing.xs,
  },
});

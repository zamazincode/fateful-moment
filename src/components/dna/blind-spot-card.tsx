import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { Panel } from "@/components/ui/panel";
import { TargetIcon } from "@/components/icons/target-icon";
import { AppText } from "@/components/ui/app-text";
import { smallBodyText } from "@/components/ui/text-styles";
import { sizes, spacing } from "@/theme";

type BlindSpotCardProps = {
  trait: string;
  question: string;
  description: string;
  style?: StyleProp<ViewStyle>;
};

export function BlindSpotCard({ trait, question, description, style }: BlindSpotCardProps) {
  return (
    <Panel
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
    </Panel>
  );
}

const styles = StyleSheet.create({
  text: smallBodyText,
  description: {
    marginTop: spacing.xs,
  },
});

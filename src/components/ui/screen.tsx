import { StyleSheet, type ViewProps } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

import { colors, spacing } from "@/theme";

type ScreenProps = ViewProps & {
  edges?: Edge[];
  padded?: boolean;
};

export function Screen({ edges = ["top", "bottom"], padded = true, style, ...rest }: ScreenProps) {
  return (
    <SafeAreaView edges={edges} style={[styles.container, padded && styles.padded, style]} {...rest} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  padded: {
    paddingHorizontal: spacing.lg,
  },
});

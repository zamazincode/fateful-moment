import { StyleSheet, type TextProps } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { fonts, typography } from "@/theme";

export function ScreenTitle({ style, ...rest }: TextProps) {
  return <AppText accessibilityRole="header" style={[styles.title, style]} {...rest} />;
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.bold,
    fontSize: typography.heading3.fontSize,
    lineHeight: typography.heading3.lineHeight,
  },
});

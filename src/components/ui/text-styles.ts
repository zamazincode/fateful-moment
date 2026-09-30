import type { TextStyle } from "react-native";

import { fonts, typography } from "@/theme";

// Small body copy: regular weight on the label metrics, like the scenario card text.
export const smallBodyText: TextStyle = {
  fontFamily: fonts.regular,
  fontSize: typography.label.fontSize,
  lineHeight: typography.label.lineHeight,
};

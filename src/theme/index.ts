import { colors, gradients, palette } from "./colors";
import { radius, shadows, sizes, spacing } from "./layout";
import { fonts, typography } from "./typography";

export const theme = {
  colors,
  palette,
  gradients,
  fonts,
  typography,
  spacing,
  radius,
  sizes,
  shadows,
} as const;

export type Theme = typeof theme;

export * from "./colors";
export * from "./layout";
export * from "./typography";

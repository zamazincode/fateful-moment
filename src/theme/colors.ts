// Source: Figma "Style Guide" (node 1555:246). The palette is Tailwind-based.

export const palette = {
  cyan400: "#00D3F3",
  cyan500: "#00B8DB",
  cyan600: "#0092B8",
  slate100: "#F1F5F9",
  slate400: "#90A1B9",
  slate500: "#62748E",
  slate700: "#314158",
  slate800: "#1D293D",
  slate900: "#0F172A",
  slate950: "#020617",
  red500: "#FB2C36",
  green500: "#00C950",
  white: "#FFFFFF",
} as const;

export const colors = {
  primary: palette.cyan400,
  primaryStrong: palette.cyan500,
  primaryPressed: palette.cyan600,
  primaryTint: "rgba(0, 184, 219, 0.05)",
  primaryMuted: "rgba(0, 184, 219, 0.2)",
  primaryDisabledText: "rgba(0, 184, 219, 0.5)",

  background: palette.slate950,
  surface: palette.slate900,
  surfaceTranslucent: "rgba(15, 23, 42, 0.5)",
  surfaceRaised: palette.slate800,

  border: palette.slate800,
  borderStrong: palette.slate700,
  hairline: "rgba(255, 255, 255, 0.1)",

  text: palette.slate100,
  textSecondary: palette.slate400,
  textMuted: palette.slate500,
  textOnPrimary: palette.slate950,
  textOnDanger: palette.white,

  danger: palette.red500,
  success: palette.green500,
} as const;

export const gradients = {
  timer: [palette.cyan500, palette.red500],
} as const;

export type ColorToken = keyof typeof colors;

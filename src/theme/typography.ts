import {
  Inter_400Regular,
  Inter_400Regular_Italic,
  Inter_700Bold,
  Inter_700Bold_Italic,
  Inter_900Black,
  Inter_900Black_Italic,
} from "@expo-google-fonts/inter";
import { Platform, type TextStyle } from "react-native";

// Pass to `useFonts` in the root layout.
export const fontAssets = {
  Inter_400Regular,
  Inter_400Regular_Italic,
  Inter_700Bold,
  Inter_700Bold_Italic,
  Inter_900Black,
  Inter_900Black_Italic,
};

// Each weight/style is its own family, so don't set fontWeight or fontStyle
// alongside these because Android falls back to the system font if you do.
export const fonts = {
  regular: "Inter_400Regular",
  italic: "Inter_400Regular_Italic",
  bold: "Inter_700Bold",
  boldItalic: "Inter_700Bold_Italic",
  black: "Inter_900Black",
  blackItalic: "Inter_900Black_Italic",
  mono: Platform.select({ ios: "Menlo", default: "monospace" }),
} as const;

export const typography = {
  display: {
    fontFamily: fonts.blackItalic,
    fontSize: 60,
    lineHeight: 60,
    letterSpacing: -2.74,
    textTransform: "uppercase",
  },
  heading1: {
    fontFamily: fonts.blackItalic,
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -1.43,
    textTransform: "uppercase",
  },
  heading2: {
    fontFamily: fonts.blackItalic,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -1.1,
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontFamily: fonts.boldItalic,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.53,
    textTransform: "uppercase",
  },
  heading3: {
    fontFamily: fonts.blackItalic,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.45,
    textTransform: "uppercase",
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 26,
    letterSpacing: -0.31,
  },
  bodySmall: {
    fontFamily: fonts.italic,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.15,
  },
  button: {
    fontFamily: fonts.black,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 1.29,
    textTransform: "uppercase",
  },
  option: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 1.25,
    textTransform: "uppercase",
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: 16,
    textTransform: "uppercase",
  },
  overline: {
    fontFamily: fonts.mono,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  hud: {
    fontFamily: fonts.mono,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  caption: {
    fontFamily: fonts.mono,
    fontSize: 10,
    lineHeight: 15,
    textTransform: "uppercase",
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;

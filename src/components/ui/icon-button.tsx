import type { ReactNode } from "react";
import { Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from "react-native";

import { colors, radius, sizes } from "@/theme";

type IconButtonProps = Omit<PressableProps, "style" | "children"> & {
  accessibilityLabel: string;
  children: ReactNode;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({ children, size = sizes.iconButton, style, ...rest }: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={8}
      style={({ pressed }) => [styles.base, { width: size, height: size }, pressed && styles.pressed, style]}
      {...rest}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.hairline,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.7,
  },
});

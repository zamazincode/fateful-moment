import { router } from "expo-router";
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { colors } from "@/theme";

// The landscape screens use a bare arrow; the auth back button has a circle.
const BUTTON_SIZE = 40;
const ICON_SIZE = 24;

type BackArrowButtonProps = {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function BackArrowButton({ onPress = () => router.back(), style }: BackArrowButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
    >
      <ArrowLeftIcon size={ICON_SIZE} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});

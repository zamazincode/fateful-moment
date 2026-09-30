import { useNavigation } from "expo-router";
import { DrawerActions } from "expo-router/react-navigation";
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { MenuIcon } from "@/components/icons/menu-icon";

// The 20pt icon in a 40pt touch target, the same size as the back button.
const MENU_BUTTON_SIZE = 40;

type MenuButtonProps = {
  style?: StyleProp<ViewStyle>;
};

export function MenuButton({ style }: MenuButtonProps) {
  const navigation = useNavigation();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open menu"
      hitSlop={8}
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
    >
      <MenuIcon />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: MENU_BUTTON_SIZE,
    height: MENU_BUTTON_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});

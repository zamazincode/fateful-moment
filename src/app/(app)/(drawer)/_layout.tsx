import { Drawer } from "expo-router/drawer";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SIDE_MENU_WIDTH, SideMenu } from "@/components/navigation/side-menu";
import { colors } from "@/theme";

const PANEL_BACKGROUND = `${colors.background}F2`;
const OVERLAY = `${colors.background}99`;

export default function DrawerLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Drawer
      drawerContent={({ state, navigation }) => (
        <SideMenu
          activeRoute={state.routes[state.index].name}
          onSelect={(route) => {
            navigation.navigate(route);
            navigation.closeDrawer();
          }}
        />
      )}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        overlayColor: OVERLAY,
        drawerStyle: [styles.panel, { width: SIDE_MENU_WIDTH + insets.left }],
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Drawer.Screen name="index" />
      <Drawer.Screen name="dna" />
      <Drawer.Screen name="settings" />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: PANEL_BACKGROUND,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: colors.border,
  },
});

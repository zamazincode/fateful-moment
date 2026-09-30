import type { ComponentType } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CompassIcon } from "@/components/icons/compass-icon";
import { DnaIcon } from "@/components/icons/dna-icon";
import { SettingsIcon } from "@/components/icons/settings-icon";
import { AppText } from "@/components/ui/app-text";
import { colors, radius, shadows, spacing } from "@/theme";

export const SIDE_MENU_WIDTH = 256;
const ITEM_HEIGHT = 46;
// Measured: the active item is cyan at 10% with a 35% border.
const ACTIVE_FILL = `${colors.primaryStrong}1A`;
const ACTIVE_BORDER = `${colors.primaryStrong}59`;
const ACTIVE_DOT_SIZE = spacing.xxs;

export type SideMenuRoute = "index" | "dna" | "settings";

type Item = {
  route: SideMenuRoute;
  label: string;
  Icon: ComponentType<{ color?: string }>;
};

const items: Item[] = [
  { route: "index", label: "Scenarios", Icon: CompassIcon },
  { route: "dna", label: "DNA", Icon: DnaIcon },
  { route: "settings", label: "Settings", Icon: SettingsIcon },
];

type SideMenuProps = {
  activeRoute: string;
  onSelect: (route: SideMenuRoute) => void;
};

export function SideMenu({ activeRoute, onSelect }: SideMenuProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.menu, { paddingLeft: spacing.lg + insets.left }]}>
      {items.map(({ route, label, Icon }) => {
        const active = route === activeRoute;
        const tint = active ? colors.primary : colors.textSecondary;
        return (
          <Pressable
            key={route}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ selected: active }}
            onPress={() => onSelect(route)}
            style={({ pressed }) => [styles.item, active && styles.active, pressed && styles.pressed]}
          >
            <Icon color={tint} />
            <AppText variant="label" style={[styles.label, { color: tint }]}>
              {label}
            </AppText>
            {active ? <View testID="active-dot" style={styles.dot} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
  item: {
    height: ITEM_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: colors.surface,
    backgroundColor: colors.surfaceTranslucent,
  },
  active: {
    borderColor: ACTIVE_BORDER,
    backgroundColor: ACTIVE_FILL,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    flex: 1,
  },
  dot: {
    width: ACTIVE_DOT_SIZE,
    height: ACTIVE_DOT_SIZE,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    boxShadow: shadows.glowPrimary,
  },
});

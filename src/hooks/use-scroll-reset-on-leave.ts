import { useFocusEffect } from "expo-router";
import { useCallback, type RefObject } from "react";
import type { ScrollView } from "react-native";

// Drawer screens stay mounted, so they would reopen where they were scrolled to. Resetting on
// blur rather than on focus means the screen is already at the top when it comes back, no jump.
export function useScrollResetOnLeave(ref: RefObject<ScrollView | null>) {
  useFocusEffect(
    useCallback(() => {
      return () => ref.current?.scrollTo({ x: 0, y: 0, animated: false });
    }, [ref]),
  );
}

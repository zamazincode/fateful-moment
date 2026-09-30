import { setVisibilityAsync } from "expo-navigation-bar";
import { useEffect } from "react";
import { AppState, Platform } from "react-native";

// Hides the Android navigation bar while mounted. Not the <NavigationBar> component: it caches
// the last value in JS, so it never hides the bar again when Android shows it after the app
// returns from the background, and its unmount call rejects unhandled once the activity is gone.
// `setVisibilityAsync` is deprecated but is the only call that skips that cache and returns the
// promise.
export function useHiddenNavigationBar() {
  useEffect(() => {
    if (Platform.OS !== "android") return;

    const hide = () => setVisibilityAsync("hidden").catch(() => {});
    hide();

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") hide();
    });

    return () => {
      subscription.remove();
      setVisibilityAsync("visible").catch(() => {});
    };
  }, []);
}

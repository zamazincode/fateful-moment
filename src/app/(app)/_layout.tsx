import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useHiddenNavigationBar } from "@/hooks/use-hidden-navigation-bar";
import { MusicPlayerProvider } from "@/store/music-player";
import { colors } from "@/theme";

export default function AppLayout() {
  useHiddenNavigationBar();

  return (
    <MusicPlayerProvider>
      <StatusBar hidden />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(drawer)" />
        {/* No swipe back: an edge swipe would end the simulation by accident. */}
        <Stack.Screen name="scenario/[id]" options={{ gestureEnabled: false }} />
      </Stack>
    </MusicPlayerProvider>
  );
}

import { NavigationBar } from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { MusicPlayerProvider } from "@/store/music-player";
import { colors } from "@/theme";

export default function AppLayout() {
  return (
    <MusicPlayerProvider>
      <StatusBar hidden />
      <NavigationBar hidden />
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

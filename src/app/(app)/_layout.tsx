import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { MusicPlayerProvider } from "@/store/music-player";
import { colors } from "@/theme";

// The music player lives above the side menu so it keeps playing across the
// menu screens and, later, the simulation screens stacked on top of them.
export default function AppLayout() {
  return (
    <MusicPlayerProvider>
      {/* The landscape design has no status bar. */}
      <StatusBar hidden />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(drawer)" />
      </Stack>
    </MusicPlayerProvider>
  );
}

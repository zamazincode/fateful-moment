import { useEventListener } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect } from "react";
import { AppState, StyleSheet, View } from "react-native";

import { getSettings } from "@/store/settings";
import { colors } from "@/theme";

type SimulationVideoProps = {
  source: number;
  onEnd: () => void;
};

// A full screen video without controls that starts on its own.
// Render it with a `key` per video so every clip gets a fresh player.
export function SimulationVideo({ source, onEnd }: SimulationVideoProps) {
  const player = useVideoPlayer(source, (video) => {
    video.muted = !getSettings().videoSound;
    video.play();
  });

  useEventListener(player, "playToEnd", onEnd);

  // expo-video pauses in the background but doesn't resume a view without controls; a finished
  // clip has already unmounted this, so resuming is always safe.
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") player.play();
    });
    return () => subscription.remove();
  }, [player]);

  return (
    <View testID="simulation-video" style={[StyleSheet.absoluteFill, styles.container]}>
      <VideoView
        player={player}
        nativeControls={false}
        contentFit="cover"
        // Android: lets the back arrow sit on top of the video.
        surfaceType="textureView"
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
});

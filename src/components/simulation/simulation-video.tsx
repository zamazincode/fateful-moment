import { useEventListener } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { StyleSheet, View } from "react-native";

import { colors } from "@/theme";

type SimulationVideoProps = {
  source: number;
  onEnd: () => void;
};

// A full screen video without controls that starts on its own.
// Render it with a `key` per video so every clip gets a fresh player.
export function SimulationVideo({ source, onEnd }: SimulationVideoProps) {
  const player = useVideoPlayer(source, (video) => video.play());

  useEventListener(player, "playToEnd", onEnd);

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

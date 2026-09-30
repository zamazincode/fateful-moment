import { Image } from "expo-image";
import { useEffect, useReducer } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppHeader } from "@/components/navigation/app-header";
import { BackArrowButton } from "@/components/navigation/back-arrow-button";
import { ScenarioBriefing } from "@/components/scenarios/scenario-briefing";
import { DangerVignette } from "@/components/simulation/danger-vignette";
import { OptionGrid } from "@/components/simulation/option-grid";
import type { OptionState } from "@/components/simulation/option-card";
import { SimulationVideo } from "@/components/simulation/simulation-video";
import { TimerBar } from "@/components/simulation/timer-bar";
import type { Scenario } from "@/data/scenarios";
import { useCountdown } from "@/hooks/use-countdown";
import { createSimulation, simulationReducer, unwatchedOptions } from "@/lib/simulation";
import { useMusicPlayer } from "@/store/music-player";
import { colors, spacing } from "@/theme";

export const FIRST_ROUND_MS = 15_000;
export const WARNING_MS = 5_000;
export const REVEAL_DELAY_MS = 600;
const BACKGROUND_SCRIM = "rgba(0, 0, 0, 0.5)";

type ScenarioSimulationProps = {
  scenario: Scenario;
  onExit: () => void;
  onFinish: () => void;
};

export function ScenarioSimulation({ scenario, onExit, onFinish }: ScenarioSimulationProps) {
  const insets = useSafeAreaInsets();
  const [state, dispatch] = useReducer(simulationReducer, scenario.options.length, createSimulation);
  const { phase, picked, watched } = state;
  const { media } = scenario;
  const { suspend, resume } = useMusicPlayer();
  const simulating = phase.kind !== "briefing";

  const timed = phase.kind === "choice" && phase.round === 0;
  const progress = useCountdown(FIRST_ROUND_MS, timed && picked === null, () => {
    const open = unwatchedOptions(state);
    dispatch({ type: "pick", index: open[Math.floor(Math.random() * open.length)] });
  });
  const danger = progress.interpolate({
    inputRange: [0, WARNING_MS / FIRST_ROUND_MS, 1],
    outputRange: [1, 0, 0],
    extrapolate: "clamp",
  });

  useEffect(() => {
    if (picked === null) return;
    const timer = setTimeout(() => dispatch({ type: "reveal" }), REVEAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [picked]);

  // Silent from Start Simulation on; leaving brings the music back if it was on.
  useEffect(() => {
    if (!simulating) return;
    suspend();
    return resume;
    // The store functions change on every render; this only follows `simulating`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulating]);

  useEffect(() => {
    if (phase.kind === "done") onFinish();
    // onFinish only matters once the simulation is over.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase.kind]);

  const backButton = (
    <BackArrowButton onPress={onExit} style={[styles.back, { left: insets.left + spacing.md }]} />
  );

  if (phase.kind === "briefing") {
    const margin = Math.max(insets.left, insets.right, spacing.lg);
    return (
      <View style={styles.screen}>
        <AppHeader left={<BackArrowButton onPress={onExit} />} />
        <ScenarioBriefing
          title={scenario.title}
          description={scenario.briefing}
          cover={media.cover}
          onStart={() => dispatch({ type: "start" })}
          style={[styles.briefing, { marginHorizontal: margin }]}
        />
      </View>
    );
  }

  if (phase.kind === "video") {
    const source = phase.video === "intro" ? media.videos.intro : media.videos.decisions[phase.video];
    return (
      <View style={styles.screen}>
        <SimulationVideo key={String(phase.video)} source={source} onEnd={() => dispatch({ type: "videoEnded" })} />
        {backButton}
      </View>
    );
  }

  if (phase.kind === "done") return <View style={styles.screen} />;

  const stateOf = (index: number): OptionState =>
    index === picked ? "selected" : watched.includes(index) ? "passive" : "default";
  const gutter = { paddingLeft: insets.left + spacing.lg, paddingRight: insets.right + spacing.lg };

  return (
    <View style={styles.screen}>
      <Image
        source={timed ? media.backgrounds.firstRound : media.backgrounds.laterRounds}
        contentFit="cover"
        style={StyleSheet.absoluteFill}
      />
      <View testID="round-scrim" style={[StyleSheet.absoluteFill, styles.scrim]} />
      {timed ? <DangerVignette intensity={danger} /> : null}

      <View style={[styles.options, gutter]}>
        <OptionGrid
          options={scenario.options}
          stateOf={stateOf}
          yourChoice={timed ? null : watched[0]}
          disabled={picked !== null}
          onPick={(index) => dispatch({ type: "pick", index })}
        />
      </View>

      {timed ? (
        <TimerBar
          progress={progress}
          style={[styles.timer, { left: insets.left + spacing.lg, right: insets.right + spacing.lg }]}
        />
      ) : null}
      {backButton}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrim: {
    backgroundColor: BACKGROUND_SCRIM,
  },
  briefing: {
    flex: 1,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  back: {
    position: "absolute",
    top: spacing.xs,
  },
  options: {
    flex: 1,
    justifyContent: "center",
  },
  timer: {
    position: "absolute",
    bottom: spacing.lg,
  },
});

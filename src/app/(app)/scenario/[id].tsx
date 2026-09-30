import { Redirect, router, useLocalSearchParams } from "expo-router";

import { ScenarioSimulation } from "@/components/simulation/scenario-simulation";
import { scenarios } from "@/data/scenarios";

export default function ScenarioScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scenario = scenarios.find((candidate) => candidate.id === id);

  if (!scenario) return <Redirect href="/" />;

  return (
    <ScenarioSimulation
      scenario={scenario}
      onExit={() => router.back()}
      onFinish={() => router.dismissTo("/dna")}
    />
  );
}

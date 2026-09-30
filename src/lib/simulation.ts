// briefing -> intro -> round 0 (timed) -> option video -> round 1 -> ... -> done.
// Timers and media stay outside so the flow can be tested on its own.

export type SimulationVideo = "intro" | number;

export type SimulationPhase =
  | { kind: "briefing" }
  | { kind: "video"; video: SimulationVideo }
  // `round` is 0 for the first, timed round.
  | { kind: "choice"; round: number }
  | { kind: "done" };

export type SimulationState = {
  phase: SimulationPhase;
  optionCount: number;
  // Option indexes in the order their videos were watched; the first is "Your Choice".
  watched: number[];
  // The option being highlighted before its video starts.
  picked: number | null;
};

export type SimulationAction =
  | { type: "start" }
  | { type: "pick"; index: number }
  | { type: "reveal" }
  | { type: "videoEnded" };

export function createSimulation(optionCount: number): SimulationState {
  return { phase: { kind: "briefing" }, optionCount, watched: [], picked: null };
}

export function canPick(state: SimulationState, index: number) {
  return (
    state.phase.kind === "choice" &&
    state.picked === null &&
    index >= 0 &&
    index < state.optionCount &&
    !state.watched.includes(index)
  );
}

export function unwatchedOptions(state: SimulationState) {
  return Array.from({ length: state.optionCount }, (_, index) => index).filter(
    (index) => !state.watched.includes(index),
  );
}

export function simulationReducer(state: SimulationState, action: SimulationAction): SimulationState {
  switch (action.type) {
    case "start":
      return state.phase.kind === "briefing" ? { ...state, phase: { kind: "video", video: "intro" } } : state;

    case "pick":
      return canPick(state, action.index) ? { ...state, picked: action.index } : state;

    case "reveal":
      if (state.phase.kind !== "choice" || state.picked === null) return state;
      return {
        ...state,
        phase: { kind: "video", video: state.picked },
        watched: [...state.watched, state.picked],
        picked: null,
      };

    case "videoEnded": {
      if (state.phase.kind !== "video") return state;
      const allWatched = state.watched.length === state.optionCount;
      return {
        ...state,
        phase: allWatched ? { kind: "done" } : { kind: "choice", round: state.watched.length },
      };
    }
  }
}

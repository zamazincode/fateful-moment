import {
  canPick,
  createSimulation,
  simulationReducer,
  unwatchedOptions,
  type SimulationAction,
  type SimulationState,
} from "@/lib/simulation";

function run(state: SimulationState, ...actions: SimulationAction[]) {
  return actions.reduce(simulationReducer, state);
}

// Picks an option and plays its video to the end.
function choose(index: number): SimulationAction[] {
  return [{ type: "pick", index }, { type: "reveal" }, { type: "videoEnded" }];
}

describe("simulation", () => {
  it("opens on the briefing and plays the intro on start", () => {
    const state = createSimulation(5);
    expect(state.phase).toEqual({ kind: "briefing" });

    expect(run(state, { type: "start" }).phase).toEqual({ kind: "video", video: "intro" });
  });

  it("goes to the timed first round after the intro", () => {
    const state = run(createSimulation(5), { type: "start" }, { type: "videoEnded" });

    expect(state.phase).toEqual({ kind: "choice", round: 0 });
  });

  it("highlights a pick first, then plays that option's video", () => {
    const round = run(createSimulation(5), { type: "start" }, { type: "videoEnded" });

    const picked = simulationReducer(round, { type: "pick", index: 1 });
    expect(picked.picked).toBe(1);
    expect(picked.phase).toEqual({ kind: "choice", round: 0 });

    const playing = simulationReducer(picked, { type: "reveal" });
    expect(playing.phase).toEqual({ kind: "video", video: 1 });
    expect(playing.watched).toEqual([1]);
    expect(playing.picked).toBeNull();
  });

  it("ignores a second pick while one is being highlighted", () => {
    const round = run(createSimulation(5), { type: "start" }, { type: "videoEnded" }, { type: "pick", index: 1 });

    expect(simulationReducer(round, { type: "pick", index: 2 }).picked).toBe(1);
  });

  it("does not let a watched option be picked again", () => {
    const state = run(createSimulation(5), { type: "start" }, { type: "videoEnded" }, ...choose(1));

    expect(state.phase).toEqual({ kind: "choice", round: 1 });
    expect(canPick(state, 1)).toBe(false);
    expect(simulationReducer(state, { type: "pick", index: 1 })).toBe(state);
    expect(unwatchedOptions(state)).toEqual([0, 2, 3, 4]);
  });

  it("keeps the first choice first in the watched list", () => {
    const state = run(createSimulation(5), { type: "start" }, { type: "videoEnded" }, ...choose(3), ...choose(0));

    expect(state.watched).toEqual([3, 0]);
  });

  it("finishes once every option's video has been watched", () => {
    const state = run(
      createSimulation(5),
      { type: "start" },
      { type: "videoEnded" },
      ...choose(2),
      ...choose(0),
      ...choose(4),
      ...choose(1),
      { type: "pick", index: 3 },
      { type: "reveal" },
    );
    expect(state.phase).toEqual({ kind: "video", video: 3 });

    expect(simulationReducer(state, { type: "videoEnded" }).phase).toEqual({ kind: "done" });
  });

  it("ignores actions that don't fit the current phase", () => {
    const briefing = createSimulation(5);
    expect(simulationReducer(briefing, { type: "pick", index: 0 })).toBe(briefing);
    expect(simulationReducer(briefing, { type: "reveal" })).toBe(briefing);
    expect(simulationReducer(briefing, { type: "videoEnded" })).toBe(briefing);

    const intro = run(briefing, { type: "start" });
    expect(simulationReducer(intro, { type: "start" })).toBe(intro);
    expect(simulationReducer(intro, { type: "pick", index: 0 })).toBe(intro);
  });

  it("rejects out of range picks", () => {
    const round = run(createSimulation(5), { type: "start" }, { type: "videoEnded" });

    expect(canPick(round, -1)).toBe(false);
    expect(canPick(round, 5)).toBe(false);
  });
});

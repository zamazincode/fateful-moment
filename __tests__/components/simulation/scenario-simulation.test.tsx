import { act, fireEvent, render, screen, userEvent } from "@testing-library/react-native";
import * as audio from "expo-audio";
import * as video from "expo-video";

import {
  FIRST_ROUND_MS,
  REVEAL_DELAY_MS,
  ScenarioSimulation,
} from "@/components/simulation/scenario-simulation";
import { scenarios } from "@/data/scenarios";
import { MusicPlayerProvider } from "@/store/music-player";

jest.mock("react-native-safe-area-context", () => require("react-native-safe-area-context/jest/mock").default);

// Both native modules resolve to the in-memory mocks in __mocks__.
const { players } = video as unknown as typeof import("../../../__mocks__/expo-video");
const { playlists } = audio as unknown as typeof import("../../../__mocks__/expo-audio");

const scenario = scenarios[0];
const [first, second, third, fourth, fifth] = scenario.options;

const lastPlayer = () => players[players.length - 1];

async function renderSimulation(onExit = jest.fn(), onFinish = jest.fn()) {
  await render(
    <MusicPlayerProvider>
      <ScenarioSimulation scenario={scenario} onExit={onExit} onFinish={onFinish} />
    </MusicPlayerProvider>,
  );
  return { onExit, onFinish };
}

async function endVideo() {
  await act(() => lastPlayer().emit("playToEnd"));
}

// The option grid lays its cards out once it knows its width.
async function layOutOptions() {
  await fireEvent(screen.getByTestId("option-grid"), "layout", { nativeEvent: { layout: { width: 702 } } });
}

async function startAndReachFirstRound() {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  await user.press(screen.getByRole("button", { name: "Start Simulation" }));
  await endVideo();
  await layOutOptions();
  return user;
}

async function pickAndWatch(user: ReturnType<typeof userEvent.setup>, label: string) {
  await user.press(screen.getByRole("button", { name: label }));
  await act(() => jest.advanceTimersByTime(REVEAL_DELAY_MS));
  await endVideo();
  if (screen.queryByTestId("option-grid")) await layOutOptions();
}

beforeEach(() => {
  jest.useFakeTimers();
  players.length = 0;
  playlists.length = 0;
});
afterEach(() => jest.useRealTimers());

describe("ScenarioSimulation", () => {
  it("opens on the briefing with the scenario's title and text", async () => {
    await renderSimulation();

    expect(screen.getByText("Scenario Briefing")).toBeOnTheScreen();
    expect(screen.getByText(scenario.title)).toBeOnTheScreen();
    expect(screen.getByText(scenario.briefing)).toBeOnTheScreen();
    expect(screen.getByTestId("music-player")).toBeOnTheScreen();
  });

  it("leaves from the briefing's back arrow", async () => {
    const { onExit } = await renderSimulation();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    await user.press(screen.getByRole("button", { name: "Go back" }));

    expect(onExit).toHaveBeenCalled();
  });

  it("plays the intro on start", async () => {
    await renderSimulation();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    await user.press(screen.getByRole("button", { name: "Start Simulation" }));

    expect(screen.getByTestId("simulation-video")).toBeOnTheScreen();
    expect(lastPlayer().source).toBe(scenario.media.videos.intro);
    expect(lastPlayer().play).toHaveBeenCalled();
  });

  it("keeps the music on the briefing but silent through the videos and rounds", async () => {
    await renderSimulation();
    await act(() => playlists[0].play());
    expect(playlists[0].playing).toBe(true);

    await startAndReachFirstRound();

    expect(playlists[0].playing).toBe(false);
  });

  it("brings the music back when the simulation is left", async () => {
    await renderSimulation();
    await act(() => playlists[0].play());
    await startAndReachFirstRound();

    await screen.unmount();

    expect(playlists[0].playing).toBe(true);
  });

  it("darkens the round background by half", async () => {
    await renderSimulation();
    await startAndReachFirstRound();

    expect(screen.getByTestId("round-scrim")).toHaveStyle({ backgroundColor: "rgba(0, 0, 0, 0.5)" });
  });

  it("shows the timed first round after the intro", async () => {
    await renderSimulation();
    await startAndReachFirstRound();

    expect(screen.getAllByRole("button", { name: /./ }).map((button) => button.props.accessibilityLabel)).toEqual(
      expect.arrayContaining([first, second, third, fourth, fifth]),
    );
    expect(screen.getByRole("progressbar", { name: "Time left" })).toBeOnTheScreen();
    expect(screen.getByTestId("danger-vignette")).toBeOnTheScreen();
  });

  it("lights a tapped option, then plays its video", async () => {
    await renderSimulation();
    const user = await startAndReachFirstRound();

    await user.press(screen.getByRole("button", { name: second }));
    expect(screen.getByRole("button", { name: second })).toBeSelected();
    expect(screen.getByRole("button", { name: third })).toBeDisabled();

    await act(() => jest.advanceTimersByTime(REVEAL_DELAY_MS));
    expect(lastPlayer().source).toBe(scenario.media.videos.decisions[1]);
  });

  it("takes a random option when the first round runs out", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.99);
    await renderSimulation();
    await startAndReachFirstRound();

    await act(() => jest.advanceTimersByTime(FIRST_ROUND_MS));
    expect(screen.getByRole("button", { name: fifth })).toBeSelected();

    await act(() => jest.advanceTimersByTime(REVEAL_DELAY_MS));
    expect(lastPlayer().source).toBe(scenario.media.videos.decisions[4]);
  });

  it("marks the first decision as Your Choice in the untimed later rounds", async () => {
    await renderSimulation();
    const user = await startAndReachFirstRound();

    await pickAndWatch(user, second);

    expect(screen.getByRole("button", { name: `${second}, your choice` })).toBeDisabled();
    expect(screen.getByText("Your Choice")).toBeOnTheScreen();
    expect(screen.queryByRole("progressbar")).not.toBeOnTheScreen();
    expect(screen.queryByTestId("danger-vignette")).not.toBeOnTheScreen();

    await pickAndWatch(user, fourth);
    expect(screen.getByRole("button", { name: fourth })).toBeDisabled();
    expect(screen.getByRole("button", { name: `${second}, your choice` })).toBeOnTheScreen();
  });

  it("finishes after all five videos", async () => {
    const { onFinish } = await renderSimulation();
    const user = await startAndReachFirstRound();

    for (const label of [third, first, fifth, second]) await pickAndWatch(user, label);
    expect(onFinish).not.toHaveBeenCalled();

    await pickAndWatch(user, fourth);
    expect(onFinish).toHaveBeenCalledTimes(1);
  });
});

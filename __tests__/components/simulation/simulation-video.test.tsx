import { act, render } from "@testing-library/react-native";
import * as video from "expo-video";
import { AppState, type AppStateStatus } from "react-native";

import { SimulationVideo } from "@/components/simulation/simulation-video";
import { updateSettings } from "@/store/settings";

const { players } = video as unknown as typeof import("../../../__mocks__/expo-video");

let appStateListener: ((state: AppStateStatus) => void) | null = null;
const removeListener = jest.fn();

beforeEach(() => {
  players.length = 0;
  removeListener.mockClear();
  appStateListener = null;
  jest.spyOn(AppState, "addEventListener").mockImplementation((_event, listener) => {
    appStateListener = listener;
    return { remove: removeListener };
  });
});

afterEach(() => jest.restoreAllMocks());

describe("SimulationVideo", () => {
  it("starts playing on mount", async () => {
    await render(<SimulationVideo source={1} onEnd={jest.fn()} />);

    expect(players).toHaveLength(1);
    expect(players[0].play).toHaveBeenCalledTimes(1);
  });

  it("calls onEnd when the clip finishes", async () => {
    const onEnd = jest.fn();
    await render(<SimulationVideo source={1} onEnd={onEnd} />);

    await act(() => players[0].emit("playToEnd"));

    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it("resumes when the app returns to the foreground", async () => {
    await render(<SimulationVideo source={1} onEnd={jest.fn()} />);

    await act(() => appStateListener?.("background"));
    expect(players[0].play).toHaveBeenCalledTimes(1);

    await act(() => appStateListener?.("active"));
    expect(players[0].play).toHaveBeenCalledTimes(2);
  });

  it("stops listening to the app state on unmount", async () => {
    const screen = await render(<SimulationVideo source={1} onEnd={jest.fn()} />);

    await screen.unmount();

    expect(removeListener).toHaveBeenCalled();
  });

  it("plays with sound unless video sound is off in Settings", async () => {
    await render(<SimulationVideo source={1} onEnd={jest.fn()} />);
    expect(players[0].muted).toBe(false);

    updateSettings({ videoSound: false });
    await render(<SimulationVideo source={2} onEnd={jest.fn()} />);
    expect(players[1].muted).toBe(true);
  });
});

import { act, render, screen, userEvent } from "@testing-library/react-native";
import { router } from "expo-router";
import { Animated } from "react-native";

import Scenarios from "@/app/(app)/(drawer)/index";
import { DIM_DURATION_MS, DIMMED_OPACITY } from "@/components/scenarios/scenario-card";
import { scenarios } from "@/data/scenarios";
import { MusicPlayerProvider } from "@/store/music-player";

jest.mock("react-native-safe-area-context", () => require("react-native-safe-area-context/jest/mock").default);

// useFocusEffect runs its callback on mount and keeps it, so a test can call
// it again to play the screen coming back into focus.
let mockFocusCallbacks: (() => void)[] = [];
jest.mock("expo-router", () => {
  const { useEffect } = require("react");
  return {
    router: { push: jest.fn() },
    useNavigation: () => ({ dispatch: jest.fn() }),
    useFocusEffect: (callback: () => void) => {
      useEffect(() => {
        mockFocusCallbacks.push(callback);
        callback();
      }, [callback]);
    },
  };
});

function renderScreen() {
  return render(
    <MusicPlayerProvider>
      <Scenarios />
    </MusicPlayerProvider>,
  );
}

// Jest mocks the native animation module, so the card fades are checked by
// the targets they were started with.
function fadeTargets(timing: jest.SpyInstance) {
  return timing.mock.calls.map(([, config]) => config.toValue);
}

let timing: jest.SpyInstance;

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  mockFocusCallbacks = [];
  timing = jest.spyOn(Animated, "timing");
});
afterEach(() => {
  timing.mockRestore();
  jest.useRealTimers();
});

describe("Scenarios screen", () => {
  it("shows the header, the intro and how many scenarios there are", async () => {
    await renderScreen();

    expect(screen.getByRole("button", { name: "Open menu" })).toBeOnTheScreen();
    expect(screen.getByTestId("music-player")).toBeOnTheScreen();
    expect(screen.getByText("Scenarios")).toBeOnTheScreen();
    expect(
      screen.getByText('Choose A Scenario And Ask Yourself, "If You Were In That Situation, What Would You Do?"'),
    ).toBeOnTheScreen();
    expect(screen.getByText(`${scenarios.length} Scenarios`)).toBeOnTheScreen();
  });

  it("lists the scenarios as cards", async () => {
    await renderScreen();

    expect(screen.getByText("Iraq War")).toBeOnTheScreen();
    expect(screen.getByText("Cuban Missile Crisis (1962)")).toBeOnTheScreen();
  });

  it("fades the other cards, then opens the started scenario's briefing", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await renderScreen();
    timing.mockClear();

    await user.press(screen.getByRole("button", { name: "Start Cuban Missile Crisis (1962)" }));
    expect(fadeTargets(timing).filter((target) => target === DIMMED_OPACITY)).toHaveLength(scenarios.length - 1);
    expect(router.push).not.toHaveBeenCalled();

    await act(() => jest.advanceTimersByTime(DIM_DURATION_MS));
    expect(router.push).toHaveBeenCalledWith({
      pathname: "/scenario/[id]",
      params: { id: "cuban-missile-crisis" },
    });
  });

  it("ignores a second Start while the first one is on its way", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await renderScreen();

    await user.press(screen.getByRole("button", { name: "Start Iraq War" }));
    await user.press(screen.getByRole("button", { name: "Start Cuban Missile Crisis (1962)" }));
    await act(() => jest.advanceTimersByTime(DIM_DURATION_MS));

    expect(router.push).toHaveBeenCalledTimes(1);
    expect(router.push).toHaveBeenCalledWith({ pathname: "/scenario/[id]", params: { id: "iraq-war" } });
  });

  it("lights every card again when the screen is back in focus", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await renderScreen();
    await user.press(screen.getByRole("button", { name: "Start Iraq War" }));
    await act(() => jest.advanceTimersByTime(DIM_DURATION_MS));
    timing.mockClear();

    await act(() => mockFocusCallbacks[mockFocusCallbacks.length - 1]());

    expect(fadeTargets(timing)).toEqual(Array(scenarios.length - 1).fill(1));
  });
});

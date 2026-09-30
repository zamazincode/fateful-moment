import { act, render } from "@testing-library/react-native";
import { setVisibilityAsync } from "expo-navigation-bar";
import { AppState, type AppStateStatus, Platform } from "react-native";

import { useHiddenNavigationBar } from "@/hooks/use-hidden-navigation-bar";

jest.mock("expo-navigation-bar", () => ({
  setVisibilityAsync: jest.fn(() => Promise.resolve()),
}));

const setVisibility = jest.mocked(setVisibilityAsync);
let appStateListener: ((state: AppStateStatus) => void) | null = null;
const removeListener = jest.fn();

function Host() {
  useHiddenNavigationBar();
  return null;
}

beforeEach(() => {
  setVisibility.mockReset().mockResolvedValue(undefined);
  removeListener.mockClear();
  appStateListener = null;
  jest.spyOn(AppState, "addEventListener").mockImplementation((_event, listener) => {
    appStateListener = listener;
    return { remove: removeListener };
  });
});

afterEach(() => jest.restoreAllMocks());

describe("useHiddenNavigationBar on Android", () => {
  beforeEach(() => jest.replaceProperty(Platform, "OS", "android"));

  it("hides the bar on mount", async () => {
    await render(<Host />);

    expect(setVisibility).toHaveBeenCalledTimes(1);
    expect(setVisibility).toHaveBeenLastCalledWith("hidden");
  });

  it("hides it again when the app returns to the foreground", async () => {
    await render(<Host />);

    await act(() => appStateListener?.("background"));
    expect(setVisibility).toHaveBeenCalledTimes(1);

    await act(() => appStateListener?.("active"));
    expect(setVisibility).toHaveBeenCalledTimes(2);
    expect(setVisibility).toHaveBeenLastCalledWith("hidden");
  });

  it("shows the bar and stops listening on unmount", async () => {
    const screen = await render(<Host />);

    await screen.unmount();

    expect(setVisibility).toHaveBeenLastCalledWith("visible");
    expect(removeListener).toHaveBeenCalled();
  });

  it("catches the rejection when the activity is already gone", async () => {
    const rejection = Promise.reject(new Error("The current activity is no longer available"));
    const caught = jest.spyOn(rejection, "catch");
    setVisibility.mockReturnValue(rejection);

    const screen = await render(<Host />);
    await screen.unmount();

    expect(caught).toHaveBeenCalledTimes(2);
  });
});

describe("useHiddenNavigationBar on iOS", () => {
  beforeEach(() => jest.replaceProperty(Platform, "OS", "ios"));

  it("does nothing", async () => {
    await render(<Host />);

    expect(setVisibility).not.toHaveBeenCalled();
    expect(appStateListener).toBeNull();
  });
});

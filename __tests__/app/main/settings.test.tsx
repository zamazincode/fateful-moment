import { fireEvent, render, screen, userEvent } from "@testing-library/react-native";
import * as audio from "expo-audio";
import { router } from "expo-router";
import { Alert } from "react-native";

import Settings from "@/app/(app)/(drawer)/settings";
import { tracks } from "@/data/tracks";
import { MusicPlayerProvider } from "@/store/music-player";
import { useSession, type User } from "@/store/session";
import { getSettings } from "@/store/settings";

const { playlists } = audio as unknown as typeof import("../../../__mocks__/expo-audio");

jest.mock("react-native-safe-area-context", () => require("react-native-safe-area-context/jest/mock").default);
jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
  useNavigation: () => ({ dispatch: jest.fn() }),
  // Runs like a screen that is focused on mount and blurred on unmount.
  useFocusEffect: (callback: () => () => void) => require("react").useEffect(callback, [callback]),
}));
jest.mock("@/store/session", () => ({ useSession: jest.fn() }));

const signOut = jest.fn();
const deleteAccount = jest.fn();

function signedInAs(user: User) {
  jest.mocked(useSession).mockReturnValue({
    user,
    status: "ready",
    signIn: jest.fn(),
    signUp: jest.fn(),
    signInWithProvider: jest.fn(),
    signOut,
    changePassword: jest.fn(),
    deleteAccount,
  });
}

async function renderScreen() {
  await render(
    <MusicPlayerProvider>
      <Settings />
    </MusicPlayerProvider>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  playlists.length = 0;
  signedInAs({ name: "John Doe", email: "johndoe@mail.com" });
});

describe("Settings screen", () => {
  it("shows the title and the signed in user", async () => {
    await renderScreen();

    expect(screen.getByRole("header", { name: "Settings" })).toBeOnTheScreen();
    expect(screen.getByText("John Doe")).toBeOnTheScreen();
    expect(screen.getByText("johndoe@mail.com")).toBeOnTheScreen();
  });

  it("opens the change password screen", async () => {
    await renderScreen();

    await userEvent.press(screen.getByRole("button", { name: "Change Password" }));

    expect(router.push).toHaveBeenCalledWith("/change-password");
  });

  it("has no password to change for a demo user", async () => {
    signedInAs({ name: "Google User", email: "google.demo@fatefulmoment.app", provider: "google" });
    await renderScreen();

    expect(screen.queryByRole("button", { name: "Change Password" })).toBeNull();
    expect(screen.getByText("Signed in with Google")).toBeOnTheScreen();
  });

  it("signs out", async () => {
    await renderScreen();

    await userEvent.press(screen.getByRole("button", { name: "Sign Out" }));

    expect(signOut).toHaveBeenCalled();
  });

  it("asks before deleting the account", async () => {
    const alert = jest.spyOn(Alert, "alert");
    await renderScreen();

    await userEvent.press(screen.getByRole("button", { name: "Delete Account" }));

    expect(deleteAccount).not.toHaveBeenCalled();
    const buttons = alert.mock.calls[0][2]!;
    expect(buttons.map((button) => button.text)).toEqual(["Cancel", "Delete"]);
    buttons[1].onPress!();
    expect(deleteAccount).toHaveBeenCalled();
  });

  it("turns haptics and video sound off", async () => {
    await renderScreen();

    await fireEvent(screen.getByLabelText("Haptic feedback"), "valueChange", false);
    await fireEvent(screen.getByLabelText("Video sound"), "valueChange", false);

    expect(getSettings()).toMatchObject({ haptics: false, videoSound: false });
  });

  it("plays and pauses the music", async () => {
    await renderScreen();

    await fireEvent(screen.getByLabelText("Music"), "valueChange", true);
    expect(playlists[0].playing).toBe(true);
    expect(screen.getByLabelText("Music")).toHaveProp("value", true);

    await fireEvent(screen.getByLabelText("Music"), "valueChange", false);
    expect(playlists[0].playing).toBe(false);
  });

  it("changes the volume and the track", async () => {
    await renderScreen();

    await userEvent.press(screen.getByLabelText("Lower volume"));
    expect(getSettings().musicVolume).toBe(0.9);
    expect(playlists[0].volume).toBe(0.9);

    await userEvent.press(screen.getByLabelText(`${tracks[1].title} by ${tracks[1].artist}`));
    expect(playlists[0].currentIndex).toBe(1);
    expect(getSettings().trackIndex).toBe(1);
  });
});

import { render, screen, userEvent } from "@testing-library/react-native";

import { MusicPlayer } from "@/components/player/music-player";
import { tracks } from "@/data/tracks";
import { MusicPlayerProvider } from "@/store/music-player";
import { colors, shadows } from "@/theme";

jest.mock("react-native-safe-area-context", () => require("react-native-safe-area-context/jest/mock").default);

function renderPlayer() {
  return render(
    <MusicPlayerProvider>
      <MusicPlayer />
    </MusicPlayerProvider>,
  );
}

describe("MusicPlayer", () => {
  it("shows the current track on standby with a play button", async () => {
    await renderPlayer();

    expect(screen.getByText("Standby")).toBeOnTheScreen();
    expect(screen.getByText(tracks[0].title)).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Play" })).toBeOnTheScreen();
  });

  it("switches to now playing and a pause button once played", async () => {
    const user = userEvent.setup();
    await renderPlayer();

    await user.press(screen.getByRole("button", { name: "Play" }));

    expect(screen.getByText("Now Playing")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Pause" })).toBeOnTheScreen();
  });

  it("skips tracks both ways", async () => {
    const user = userEvent.setup();
    await renderPlayer();

    await user.press(screen.getByRole("button", { name: "Next track" }));
    expect(screen.getByText(tracks[1].title)).toBeOnTheScreen();

    await user.press(screen.getByRole("button", { name: "Previous track" }));
    expect(screen.getByText(tracks[0].title)).toBeOnTheScreen();
  });

  it("picks a track from the playlist and plays it", async () => {
    const user = userEvent.setup();
    await renderPlayer();

    await user.press(screen.getByRole("button", { name: "Playlist" }));
    await user.press(screen.getByRole("button", { name: `${tracks[1].title} by ${tracks[1].artist}` }));

    expect(screen.getByText(tracks[1].title)).toBeOnTheScreen();
    expect(screen.getByText("Now Playing")).toBeOnTheScreen();
    expect(screen.queryByTestId("track-list")).not.toBeOnTheScreen();
  });

  it("closes the playlist when its button is pressed again", async () => {
    const user = userEvent.setup();
    await renderPlayer();

    const toggle = screen.getByRole("button", { name: "Playlist" });
    await user.press(toggle);
    expect(screen.getByTestId("track-list")).toBeOnTheScreen();

    await user.press(toggle);
    expect(screen.queryByTestId("track-list")).not.toBeOnTheScreen();
  });

  it("is the 48pt translucent pill from the design", async () => {
    await renderPlayer();

    expect(screen.getByTestId("music-player")).toHaveStyle({
      height: 48,
      width: 288,
      borderTopLeftRadius: 24,
      backgroundColor: `${colors.surface}CC`,
      boxShadow: shadows.elevated,
    });
  });
});

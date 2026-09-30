import { act, render, screen } from "@testing-library/react-native";
import * as audio from "expo-audio";
import { Text } from "react-native";

import { tracks } from "@/data/tracks";
import { MusicPlayerProvider, useMusicPlayer } from "@/store/music-player";

// expo-audio resolves to the in-memory mock (__mocks__/expo-audio.ts), which
// also exposes the playlists it has created.
const { playlists, setAudioModeAsync } = audio as unknown as typeof import("../../__mocks__/expo-audio");

type Player = ReturnType<typeof useMusicPlayer>;

// Renders the provider with a probe that prints the track and play state,
// and hands back a getter for the latest player value.
async function renderPlayer() {
  let player: Player | null = null;
  function Probe() {
    player = useMusicPlayer();
    return <Text>{`${player.track.title}|${player.playing ? "playing" : "paused"}`}</Text>;
  }
  await render(
    <MusicPlayerProvider>
      <Probe />
    </MusicPlayerProvider>,
  );
  return () => player as unknown as Player;
}

beforeEach(() => {
  playlists.length = 0;
  jest.clearAllMocks();
});

describe("MusicPlayerProvider", () => {
  it("loads every track into one looping playlist and starts on standby", async () => {
    await renderPlayer();

    expect(playlists).toHaveLength(1);
    expect(playlists[0].sources).toEqual(tracks.map((track) => track.source));
    expect(playlists[0].loop).toBe("all");
    expect(screen.getByText(`${tracks[0].title}|paused`)).toBeOnTheScreen();
  });

  it("plays in silent mode", async () => {
    await renderPlayer();

    expect(setAudioModeAsync).toHaveBeenCalledWith({ playsInSilentMode: true });
  });

  it("toggles between playing and paused", async () => {
    const player = await renderPlayer();

    await act(() => player().toggle());
    expect(screen.getByText(`${tracks[0].title}|playing`)).toBeOnTheScreen();

    await act(() => player().toggle());
    expect(screen.getByText(`${tracks[0].title}|paused`)).toBeOnTheScreen();
  });

  it("wraps around the playlist with next and previous", async () => {
    const player = await renderPlayer();

    await act(() => player().next());
    expect(screen.getByText(`${tracks[1].title}|paused`)).toBeOnTheScreen();

    await act(() => player().next());
    expect(screen.getByText(`${tracks[0].title}|paused`)).toBeOnTheScreen();

    await act(() => player().previous());
    expect(screen.getByText(`${tracks[1].title}|paused`)).toBeOnTheScreen();
  });

  it("jumps to a picked track and plays it", async () => {
    const player = await renderPlayer();

    await act(() => player().select(1));

    expect(playlists[0].skipTo).toHaveBeenCalledWith(1);
    expect(screen.getByText(`${tracks[1].title}|playing`)).toBeOnTheScreen();
  });

  it("pauses for a video and resumes the music that was playing", async () => {
    const player = await renderPlayer();
    await act(() => player().play());

    await act(() => player().suspend());
    expect(screen.getByText(`${tracks[0].title}|paused`)).toBeOnTheScreen();

    await act(() => player().resume());
    expect(screen.getByText(`${tracks[0].title}|playing`)).toBeOnTheScreen();
  });

  it("stays quiet after a video if the music was off before it", async () => {
    const player = await renderPlayer();

    await act(() => player().suspend());
    await act(() => player().resume());

    expect(playlists[0].play).not.toHaveBeenCalled();
    expect(screen.getByText(`${tracks[0].title}|paused`)).toBeOnTheScreen();
  });

  it("refuses to be used outside the provider", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    function Orphan() {
      useMusicPlayer();
      return null;
    }

    await expect(render(<Orphan />)).rejects.toThrow("useMusicPlayer must be used inside MusicPlayerProvider");
  });
});

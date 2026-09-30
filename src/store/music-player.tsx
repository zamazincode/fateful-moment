import { setAudioModeAsync, useAudioPlaylist, useAudioPlaylistStatus } from "expo-audio";
import { createContext, use, useEffect, type PropsWithChildren } from "react";

import { tracks, type Track } from "@/data/tracks";

type MusicPlayer = {
  tracks: Track[];
  track: Track;
  playing: boolean;
  toggle: () => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  select: (index: number) => void;
};

const MusicPlayerContext = createContext<MusicPlayer | null>(null);

const sources = tracks.map((track) => track.source);

// One playlist for the whole signed in area, so the music keeps going from the
// Scenarios list into the simulation. It starts paused ("standby") and loops.
// Mounted in the (app) layout: signing out unmounts it and releases the player.
export function MusicPlayerProvider({ children }: PropsWithChildren) {
  const playlist = useAudioPlaylist({ sources, loop: "all" });
  const status = useAudioPlaylistStatus(playlist);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true });
  }, []);

  const player: MusicPlayer = {
    tracks,
    track: tracks[status.currentIndex] ?? tracks[0],
    playing: status.playing,
    toggle: () => (status.playing ? playlist.pause() : playlist.play()),
    play: () => playlist.play(),
    pause: () => playlist.pause(),
    next: () => playlist.next(),
    previous: () => playlist.previous(),
    select: (index) => {
      playlist.skipTo(index);
      playlist.play();
    },
  };

  return <MusicPlayerContext value={player}>{children}</MusicPlayerContext>;
}

export function useMusicPlayer() {
  const player = use(MusicPlayerContext);
  if (!player) throw new Error("useMusicPlayer must be used inside MusicPlayerProvider");
  return player;
}

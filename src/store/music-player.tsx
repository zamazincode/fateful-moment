import { setAudioModeAsync, useAudioPlaylist, useAudioPlaylistStatus } from "expo-audio";
import { createContext, use, useEffect, useRef, type PropsWithChildren } from "react";

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
  // Pause for the simulation; resume only plays again if the music was on before.
  suspend: () => void;
  resume: () => void;
};

const MusicPlayerContext = createContext<MusicPlayer | null>(null);

const sources = tracks.map((track) => track.source);

// Mounted in the (app) layout so one playlist spans every signed in screen;
// signing out unmounts it and releases the player.
export function MusicPlayerProvider({ children }: PropsWithChildren) {
  const playlist = useAudioPlaylist({ sources, loop: "all" });
  const status = useAudioPlaylistStatus(playlist);
  const suspendedWhilePlaying = useRef(false);

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
    suspend: () => {
      suspendedWhilePlaying.current = status.playing;
      if (status.playing) playlist.pause();
    },
    resume: () => {
      if (suspendedWhilePlaying.current) playlist.play();
      suspendedWhilePlaying.current = false;
    },
  };

  return <MusicPlayerContext value={player}>{children}</MusicPlayerContext>;
}

export function useMusicPlayer() {
  const player = use(MusicPlayerContext);
  if (!player) throw new Error("useMusicPlayer must be used inside MusicPlayerProvider");
  return player;
}

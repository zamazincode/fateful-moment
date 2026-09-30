import { setAudioModeAsync, useAudioPlaylist, useAudioPlaylistStatus, type AudioPlaylist } from "expo-audio";
import { createContext, use, useEffect, useRef, type PropsWithChildren } from "react";

import { tracks, type Track } from "@/data/tracks";
import { getSettings, updateSettings, useSettings } from "@/store/settings";

type MusicPlayer = {
  tracks: Track[];
  track: Track;
  playing: boolean;
  // 0 to 1.
  volume: number;
  setVolume: (volume: number) => void;
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

// expo-audio sets the volume by assigning the property, which the React Compiler lint rejects
// on a hook's return value inside the component.
function applyVolume(playlist: AudioPlaylist, volume: number) {
  playlist.volume = volume;
}

// Mounted in the (app) layout so one playlist spans every signed in screen;
// signing out unmounts it and releases the player. The user's own play, pause and track
// choices are saved to Settings; suspend/resume for the simulation are not.
export function MusicPlayerProvider({ children }: PropsWithChildren) {
  const playlist = useAudioPlaylist({ sources, loop: "all" });
  const status = useAudioPlaylistStatus(playlist);
  const suspendedWhilePlaying = useRef(false);
  const { musicVolume } = useSettings();

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true });
  }, []);

  useEffect(() => {
    const { trackIndex, music } = getSettings();
    if (trackIndex > 0 && trackIndex < tracks.length) playlist.skipTo(trackIndex);
    if (music) playlist.play();
  }, [playlist]);

  useEffect(() => {
    applyVolume(playlist, musicVolume);
  }, [playlist, musicVolume]);

  function play() {
    playlist.play();
    updateSettings({ music: true });
  }

  function pause() {
    playlist.pause();
    updateSettings({ music: false });
  }

  function remember(index: number) {
    updateSettings({ trackIndex: (index + tracks.length) % tracks.length });
  }

  const player: MusicPlayer = {
    tracks,
    track: tracks[status.currentIndex] ?? tracks[0],
    playing: status.playing,
    volume: musicVolume,
    setVolume: (volume) => updateSettings({ musicVolume: Math.min(Math.max(volume, 0), 1) }),
    toggle: () => (status.playing ? pause() : play()),
    play,
    pause,
    next: () => {
      playlist.next();
      remember(status.currentIndex + 1);
    },
    previous: () => {
      playlist.previous();
      remember(status.currentIndex - 1);
    },
    select: (index) => {
      playlist.skipTo(index);
      remember(index);
      play();
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

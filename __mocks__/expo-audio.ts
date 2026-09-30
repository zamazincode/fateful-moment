// In-memory stand-in for expo-audio's playlist: it keeps the index and the
// playing flag like the native one does, and re-renders subscribers on change.
import { useEffect, useMemo, useState } from "react";

type Source = unknown;
type Loop = "none" | "single" | "all";

class FakePlaylist {
  currentIndex = 0;
  playing = false;
  volume = 1;
  private listeners = new Set<() => void>();

  constructor(
    readonly sources: Source[],
    readonly loop: Loop,
  ) {}

  get trackCount() {
    return this.sources.length;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit() {
    this.listeners.forEach((listener) => listener());
  }

  play = jest.fn(() => {
    this.playing = true;
    this.emit();
  });

  pause = jest.fn(() => {
    this.playing = false;
    this.emit();
  });

  next = jest.fn(() => {
    const last = this.trackCount - 1;
    if (this.currentIndex < last) this.currentIndex += 1;
    else if (this.loop === "all") this.currentIndex = 0;
    this.emit();
  });

  previous = jest.fn(() => {
    if (this.currentIndex > 0) this.currentIndex -= 1;
    else if (this.loop === "all") this.currentIndex = this.trackCount - 1;
    this.emit();
  });

  skipTo = jest.fn((index: number) => {
    this.currentIndex = index;
    this.emit();
  });
}

export const playlists: FakePlaylist[] = [];

export function useAudioPlaylist(options: { sources?: Source[]; loop?: Loop } = {}) {
  return useMemo(() => {
    const playlist = new FakePlaylist(options.sources ?? [], options.loop ?? "none");
    playlists.push(playlist);
    return playlist;
    // The native hook also creates the playlist once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function useAudioPlaylistStatus(playlist: FakePlaylist) {
  const [, setVersion] = useState(0);
  useEffect(() => playlist.subscribe(() => setVersion((version) => version + 1)), [playlist]);
  return {
    currentIndex: playlist.currentIndex,
    trackCount: playlist.trackCount,
    playing: playlist.playing,
  };
}

export const setAudioModeAsync = jest.fn(async () => {});

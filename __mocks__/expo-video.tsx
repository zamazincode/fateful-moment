// In-memory stand-in for expo-video: players remember their source, count
// play() calls and let a test fire their events (e.g. "playToEnd").
import { useMemo } from "react";
import { View, type ViewProps } from "react-native";

type Listener = () => void;

export class FakeVideoPlayer {
  private listeners = new Map<string, Set<Listener>>();
  muted = false;
  play = jest.fn();
  pause = jest.fn();

  constructor(readonly source: unknown) {}

  addListener(event: string, listener: Listener) {
    const set = this.listeners.get(event) ?? new Set();
    set.add(listener);
    this.listeners.set(event, set);
    return { remove: () => set.delete(listener) };
  }

  emit(event: string) {
    this.listeners.get(event)?.forEach((listener) => listener());
  }
}

export const players: FakeVideoPlayer[] = [];

export function useVideoPlayer(source: unknown, setup?: (player: FakeVideoPlayer) => void) {
  return useMemo(() => {
    const player = new FakeVideoPlayer(source);
    players.push(player);
    setup?.(player);
    return player;
    // Like the native hook, one player per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function VideoView(props: ViewProps & { player: FakeVideoPlayer }) {
  return <View testID="video-view" {...props} />;
}

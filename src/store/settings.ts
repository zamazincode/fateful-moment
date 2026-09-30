import { File, Paths } from "expo-file-system";
import { useSyncExternalStore } from "react";

// Device preferences, not secrets: a small JSON file in the app's documents folder, read
// synchronously so the first render already has them.
export type Settings = {
  haptics: boolean;
  // The last play/pause the user chose; the music comes back on at launch if it was on.
  music: boolean;
  // 0 to 1.
  musicVolume: number;
  // The track the player starts on.
  trackIndex: number;
  videoSound: boolean;
};

export const defaultSettings: Settings = {
  haptics: true,
  music: false,
  musicVolume: 1,
  trackIndex: 0,
  videoSound: true,
};

const FILE_NAME = "settings.json";

function settingsFile() {
  return new File(Paths.document, FILE_NAME);
}

let current: Settings | null = null;
const listeners = new Set<() => void>();

export function getSettings(): Settings {
  if (!current) {
    try {
      const file = settingsFile();
      current = { ...defaultSettings, ...(file.exists ? JSON.parse(file.textSync()) : {}) };
    } catch {
      current = defaultSettings;
    }
  }
  return current!;
}

export function updateSettings(patch: Partial<Settings>) {
  current = { ...getSettings(), ...patch };
  try {
    const file = settingsFile();
    if (!file.exists) file.create();
    file.write(JSON.stringify(current));
  } catch {
    // Keeps working for this session even if the write fails.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useSettings() {
  return useSyncExternalStore(subscribe, getSettings);
}

// Tests only: forget the cached values so the next read goes to storage again.
export function resetSettingsCache() {
  current = null;
}

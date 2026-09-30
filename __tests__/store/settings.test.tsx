import { act, renderHook } from "@testing-library/react-native";
import { File, Paths } from "expo-file-system";

import { defaultSettings, getSettings, resetSettingsCache, updateSettings, useSettings } from "@/store/settings";

function saveFile(content: string) {
  const file = new File(Paths.document, "settings.json");
  file.create();
  file.write(content);
}

describe("settings store", () => {
  it("starts from the defaults", () => {
    expect(getSettings()).toEqual(defaultSettings);
  });

  it("saves changes to a file", () => {
    updateSettings({ haptics: false, musicVolume: 0.4 });

    resetSettingsCache();

    expect(getSettings()).toEqual({ ...defaultSettings, haptics: false, musicVolume: 0.4 });
  });

  it("fills in defaults for keys an older save doesn't have", () => {
    saveFile(JSON.stringify({ videoSound: false }));
    resetSettingsCache();

    expect(getSettings()).toEqual({ ...defaultSettings, videoSound: false });
  });

  it("falls back to the defaults when the save is unreadable", () => {
    saveFile("{not json");
    resetSettingsCache();

    expect(getSettings()).toEqual(defaultSettings);
  });

  it("re-renders subscribers on change", async () => {
    const { result } = await renderHook(() => useSettings());
    expect(result.current.haptics).toBe(true);

    await act(() => updateSettings({ haptics: false }));

    expect(result.current.haptics).toBe(false);
  });
});

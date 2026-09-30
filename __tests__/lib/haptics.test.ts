import * as Haptics from "expo-haptics";

import { haptics } from "@/lib/haptics";
import { updateSettings } from "@/store/settings";

const impact = jest.mocked(Haptics.impactAsync);

beforeEach(() => jest.clearAllMocks());

describe("haptics", () => {
  it("gives a light pulse on start and a medium one on a choice", () => {
    haptics.start();
    haptics.choose();

    expect(impact.mock.calls).toEqual([[Haptics.ImpactFeedbackStyle.Light], [Haptics.ImpactFeedbackStyle.Medium]]);
  });

  it("stays silent while turned off in Settings", () => {
    updateSettings({ haptics: false });

    haptics.start();
    haptics.choose();

    expect(impact).not.toHaveBeenCalled();
  });

  it("swallows a failing vibration", async () => {
    impact.mockRejectedValueOnce(new Error("No vibrator"));

    expect(() => haptics.start()).not.toThrow();
    await Promise.resolve();
  });
});

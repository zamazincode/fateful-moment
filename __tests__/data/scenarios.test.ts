import { scenarios } from "@/data/scenarios";

describe("scenarios", () => {
  it("has the six launch scenarios with unique ids", () => {
    expect(scenarios).toHaveLength(6);
    expect(new Set(scenarios.map((scenario) => scenario.id)).size).toBe(scenarios.length);
  });

  it("gives every scenario its card and briefing text, a length and a cover", () => {
    for (const scenario of scenarios) {
      expect(scenario.title).not.toHaveLength(0);
      expect(scenario.summary).not.toHaveLength(0);
      expect(scenario.briefing).not.toHaveLength(0);
      expect(scenario.duration).toBeGreaterThan(0);
      expect(scenario.media.cover).toBeTruthy();
    }
  });

  it("gives every scenario both round backgrounds, an intro and one video per option", () => {
    for (const { media } of scenarios) {
      expect(media.backgrounds.firstRound).toBeTruthy();
      expect(media.backgrounds.laterRounds).toBeTruthy();
      expect(media.videos.intro).toBeTruthy();
      expect(media.videos.decisions).toHaveLength(5);
      expect(media.videos.decisions.every(Boolean)).toBe(true);
    }
  });

  it("starts with the two scenarios from the design", () => {
    expect(scenarios.slice(0, 2).map((scenario) => scenario.title)).toEqual([
      "Iraq War",
      "Cuban Missile Crisis (1962)",
    ]);
  });
});

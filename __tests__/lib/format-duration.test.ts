import { formatDuration } from "@/lib/format-duration";

describe("formatDuration", () => {
  it.each([
    [97, "1:37 min"],
    [85, "1:25 min"],
    [60, "1:00 min"],
    [5, "0:05 min"],
    [0, "0:00 min"],
  ])("formats %i seconds as %s", (seconds, label) => {
    expect(formatDuration(seconds)).toBe(label);
  });

  it("rounds fractions and clamps negatives", () => {
    expect(formatDuration(96.6)).toBe("1:37 min");
    expect(formatDuration(-3)).toBe("0:00 min");
  });
});

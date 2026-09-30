import { traits } from "@/data/decision-dna";
import { lowestTrait } from "@/lib/decision-dna";

const scores = { vision: 88, courage: 82, risk: 79, control: 55, empathy: 38, ethics: 31 };

describe("lowestTrait", () => {
  it("picks the lowest score", () => {
    expect(lowestTrait(scores).id).toBe("ethics");
    expect(lowestTrait({ ...scores, risk: 5 }).label).toBe("Risk");
  });

  it("picks the earlier trait on a tie", () => {
    expect(lowestTrait({ ...scores, empathy: 31 }).id).toBe("empathy");
  });

  it("returns a trait from the list", () => {
    expect(traits).toContain(lowestTrait(scores));
  });
});

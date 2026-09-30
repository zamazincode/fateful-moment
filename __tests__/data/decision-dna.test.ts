import { archetypes, decisionDna, traits } from "@/data/decision-dna";

describe("decision DNA data", () => {
  it("scores every trait between 0 and 100", () => {
    for (const trait of traits) {
      const score = decisionDna.scores[trait.id];
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    }
    expect(Object.keys(decisionDna.scores)).toHaveLength(traits.length);
  });

  it("points at an archetype with an avatar", () => {
    const archetype = archetypes[decisionDna.archetype];

    expect(archetype.title).toBe("Brave Visionary");
    expect(archetype.avatar).toBeDefined();
  });

  it("keys every archetype by its own id", () => {
    for (const [id, archetype] of Object.entries(archetypes)) {
      expect(archetype.id).toBe(id);
      expect(archetype.avatar).toBeDefined();
    }
    expect(Object.keys(archetypes)).toHaveLength(12);
  });

  it("puts the blind spot on the lowest trait", () => {
    const lowest = traits.reduce((low, trait) =>
      decisionDna.scores[trait.id] < decisionDna.scores[low.id] ? trait : low,
    );

    expect(decisionDna.blindSpot.trait).toBe(lowest.id);
  });

  it("has the three detected patterns", () => {
    expect(decisionDna.patterns).toHaveLength(3);
  });
});

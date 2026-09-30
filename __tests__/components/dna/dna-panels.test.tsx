import { render, screen } from "@testing-library/react-native";

import { ArchetypeCard } from "@/components/dna/archetype-card";
import { BlindSpotCard } from "@/components/dna/blind-spot-card";
import { PatternDetection } from "@/components/dna/pattern-detection";
import { PsychologicalMatrix } from "@/components/dna/psychological-matrix";
import { archetypes, decisionDna } from "@/data/decision-dna";
import { colors } from "@/theme";

describe("ArchetypeCard", () => {
  it("shows the archetype's avatar, title and quote", async () => {
    await render(<ArchetypeCard archetype={archetypes["brave-visionary"]} quote="Few surpass you." />);

    expect(screen.getByLabelText("Brave Visionary avatar")).toBeOnTheScreen();
    expect(screen.getByRole("header", { name: "Brave Visionary" })).toBeOnTheScreen();
    expect(screen.getByText('"Few surpass you."')).toBeOnTheScreen();
  });
});

describe("PsychologicalMatrix", () => {
  it("lists a stat card per trait in radar order", async () => {
    await render(<PsychologicalMatrix scores={decisionDna.scores} />);

    expect(screen.getByText("Psychological Matrix")).toBeOnTheScreen();
    const cards = ["Vision 88", "Courage 82", "Risk 79", "Control 55", "Empathy 38", "Ethics 31"];
    for (const card of cards) {
      expect(screen.getByLabelText(card)).toBeOnTheScreen();
    }
  });

  it("feeds the same scores to the radar chart", async () => {
    await render(<PsychologicalMatrix scores={decisionDna.scores} />);

    expect(
      screen.getByLabelText("Radar chart: Vision 88, Courage 82, Risk 79, Control 55, Empathy 38, Ethics 31"),
    ).toBeOnTheScreen();
  });
});

describe("PatternDetection", () => {
  it("numbers each pattern from 01", async () => {
    await render(<PatternDetection patterns={["First", "Second", "Third"]} />);

    expect(screen.getByText("Pattern Detection")).toBeOnTheScreen();
    ["01", "02", "03"].forEach((number) => expect(screen.getByText(number)).toBeOnTheScreen());
    ["First", "Second", "Third"].forEach((text) => expect(screen.getByText(text)).toBeOnTheScreen());
  });
});

describe("BlindSpotCard", () => {
  it("names the trait in a red header", async () => {
    await render(<BlindSpotCard trait="Ethics" question="How much?" description="Mind the cost." />);

    expect(screen.getByText("Blind Spot – Ethics")).toHaveStyle({ color: colors.danger });
    expect(screen.getByText("How much?")).toBeOnTheScreen();
    expect(screen.getByText("Mind the cost.")).toBeOnTheScreen();
  });
});

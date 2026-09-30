import { render, screen } from "@testing-library/react-native";

import DecisionDna from "@/app/(app)/(drawer)/dna";
import { decisionDna } from "@/data/decision-dna";
import { MusicPlayerProvider } from "@/store/music-player";

jest.mock("react-native-safe-area-context", () => require("react-native-safe-area-context/jest/mock").default);
jest.mock("expo-router", () => ({
  useNavigation: () => ({ dispatch: jest.fn() }),
}));

async function renderScreen() {
  await render(
    <MusicPlayerProvider>
      <DecisionDna />
    </MusicPlayerProvider>,
  );
}

describe("Decision DNA screen", () => {
  it("has the title, the menu button and the music player", async () => {
    await renderScreen();

    expect(screen.getByRole("header", { name: "Decision DNA" })).toBeOnTheScreen();
    expect(screen.getByLabelText("Open menu")).toBeOnTheScreen();
    expect(screen.getByText("Standby")).toBeOnTheScreen();
  });

  it("shows the archetype from the DNA data", async () => {
    await renderScreen();

    expect(screen.getByRole("header", { name: "Brave Visionary" })).toBeOnTheScreen();
    expect(screen.getByText(`"${decisionDna.quote}"`)).toBeOnTheScreen();
  });

  it("shows every section with its data", async () => {
    await renderScreen();

    expect(screen.getByText("Psychological Matrix")).toBeOnTheScreen();
    expect(screen.getByLabelText("Ethics 31")).toBeOnTheScreen();
    expect(screen.getByText("Pattern Detection")).toBeOnTheScreen();
    decisionDna.patterns.forEach((pattern) => expect(screen.getByText(pattern)).toBeOnTheScreen());
    expect(screen.getByText("Blind Spot – Ethics")).toBeOnTheScreen();
    expect(screen.getByText(decisionDna.blindSpot.question)).toBeOnTheScreen();
    expect(screen.getByText(decisionDna.blindSpot.description)).toBeOnTheScreen();
  });

  it("uses the corrected scenario count", async () => {
    await renderScreen();

    expect(screen.getByText(/5 out of 6 scenarios/)).toBeOnTheScreen();
  });
});

import { render, screen, userEvent } from "@testing-library/react-native";

import Scenarios from "@/app/(app)/(drawer)/index";
import { DIMMED_OPACITY } from "@/components/scenarios/scenario-card";
import { scenarios } from "@/data/scenarios";
import { MusicPlayerProvider } from "@/store/music-player";

jest.mock("react-native-safe-area-context", () => require("react-native-safe-area-context/jest/mock").default);
jest.mock("expo-router", () => ({ useNavigation: () => ({ dispatch: jest.fn() }) }));

function renderScreen() {
  return render(
    <MusicPlayerProvider>
      <Scenarios />
    </MusicPlayerProvider>,
  );
}

describe("Scenarios screen", () => {
  it("shows the header, the intro and how many scenarios there are", async () => {
    await renderScreen();

    expect(screen.getByRole("button", { name: "Open menu" })).toBeOnTheScreen();
    expect(screen.getByTestId("music-player")).toBeOnTheScreen();
    expect(screen.getByText("Scenarios")).toBeOnTheScreen();
    expect(
      screen.getByText('Choose A Scenario And Ask Yourself, "If You Were In That Situation, What Would You Do?"'),
    ).toBeOnTheScreen();
    expect(screen.getByText(`${scenarios.length} Scenarios`)).toBeOnTheScreen();
  });

  it("lists the scenarios as cards", async () => {
    await renderScreen();

    expect(screen.getByText("Iraq War")).toBeOnTheScreen();
    expect(screen.getByText("Cuban Missile Crisis (1962)")).toBeOnTheScreen();
  });

  it("keeps the started scenario lit and fades the rest", async () => {
    const user = userEvent.setup();
    await renderScreen();

    await user.press(screen.getByRole("button", { name: "Start Cuban Missile Crisis (1962)" }));

    const [iraq, cuba] = screen.getAllByTestId("scenario-card");
    expect(iraq).toHaveStyle({ opacity: DIMMED_OPACITY });
    expect(cuba).not.toHaveStyle({ opacity: DIMMED_OPACITY });
  });
});

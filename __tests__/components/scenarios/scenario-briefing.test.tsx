import { render, screen, userEvent } from "@testing-library/react-native";

import { ScenarioBriefing } from "@/components/scenarios/scenario-briefing";
import { colors, radius } from "@/theme";

const cover = { uri: "https://example.com/cover.jpg" };

function renderBriefing(onStart = jest.fn()) {
  return render(
    <ScenarioBriefing
      title="Cuban Missile Crisis (1962)"
      description="A World On The Brink Of Nuclear Annihilation. You Are In Kennedy's Seat."
      cover={cover}
      onStart={onStart}
    />,
  );
}

describe("ScenarioBriefing", () => {
  it("shows the briefing label, title and description", async () => {
    await renderBriefing();

    expect(screen.getByText("Scenario Briefing")).toBeOnTheScreen();
    expect(screen.getByText("Cuban Missile Crisis (1962)")).toBeOnTheScreen();
    expect(
      screen.getByText("A World On The Brink Of Nuclear Annihilation. You Are In Kennedy's Seat."),
    ).toBeOnTheScreen();
  });

  it("starts the simulation", async () => {
    const onStart = jest.fn();
    const user = userEvent.setup();
    await renderBriefing(onStart);

    await user.press(screen.getByRole("button", { name: "Start Simulation" }));

    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("uses a 48pt Primary Glass button with the large radius", async () => {
    await renderBriefing();

    expect(screen.getByRole("button", { name: "Start Simulation" })).toHaveStyle({
      height: 48,
      borderRadius: radius.lg,
      backgroundColor: colors.primaryMuted,
    });
  });

  it("frames the cover with 24pt corners and the border color", async () => {
    await renderBriefing();

    expect(screen.getByTestId("scenario-briefing")).toHaveStyle({
      borderRadius: 24,
      borderColor: colors.border,
    });
  });
});

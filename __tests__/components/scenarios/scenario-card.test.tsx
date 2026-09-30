import { render, screen, userEvent } from "@testing-library/react-native";
import { Animated } from "react-native";

import { DIM_DURATION_MS, DIMMED_OPACITY, ScenarioCard } from "@/components/scenarios/scenario-card";
import { colors, radius } from "@/theme";

const cover = { uri: "https://example.com/cover.jpg" };

function renderCard(props: Partial<Parameters<typeof ScenarioCard>[0]> = {}) {
  return render(
    <ScenarioCard
      title="Iraq War"
      summary="2003. The Chemical Weapon Allegations Are On Your Desk."
      duration={97}
      cover={cover}
      {...props}
    />,
  );
}

describe("ScenarioCard", () => {
  it("shows the duration, title and summary", async () => {
    await renderCard();

    expect(screen.getByText("1:37 min")).toBeOnTheScreen();
    expect(screen.getByText("Iraq War")).toBeOnTheScreen();
    expect(screen.getByText("2003. The Chemical Weapon Allegations Are On Your Desk.")).toBeOnTheScreen();
  });

  it("is the 220x176 card from the design", async () => {
    await renderCard();

    expect(screen.getByTestId("scenario-card")).toHaveStyle({
      width: 220,
      height: 176,
      borderRadius: radius.lg,
      borderColor: colors.border,
    });
  });

  it("starts the scenario from its Start pill", async () => {
    const onStart = jest.fn();
    const user = userEvent.setup();
    await renderCard({ onStart });

    await user.press(screen.getByRole("button", { name: "Start Iraq War" }));

    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("uses the Primary Glass pill for Start", async () => {
    await renderCard();

    expect(screen.getByRole("button", { name: "Start Iraq War" })).toHaveStyle({
      height: 32,
      borderRadius: radius.full,
      backgroundColor: colors.primaryMuted,
    });
  });

  // Jest mocks the native animation module, so native driven values never
  // move there; the test checks what the fade was asked to do instead.
  it("fades to 35% while another scenario is selected, and back", async () => {
    const timing = jest.spyOn(Animated, "timing");
    const { rerender } = await renderCard();
    expect(screen.getByTestId("scenario-card")).toHaveStyle({ opacity: 1 });

    await rerender(<ScenarioCard title="Iraq War" summary="Summary" duration={97} cover={cover} dimmed />);
    expect(timing).toHaveBeenLastCalledWith(expect.anything(), {
      toValue: DIMMED_OPACITY,
      duration: DIM_DURATION_MS,
      useNativeDriver: true,
    });

    await rerender(<ScenarioCard title="Iraq War" summary="Summary" duration={97} cover={cover} />);
    expect(timing).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ toValue: 1 }));
    timing.mockRestore();
  });

  it("starts dimmed without a fade when mounted while another scenario is selected", async () => {
    await render(<ScenarioCard title="Iraq War" summary="Summary" duration={97} cover={cover} dimmed />);

    expect(screen.getByTestId("scenario-card")).toHaveStyle({ opacity: DIMMED_OPACITY });
  });
});

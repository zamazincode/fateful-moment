import { render, screen } from "@testing-library/react-native";

import { TimerBar } from "@/components/simulation/timer-bar";
import { colors, gradients } from "@/theme";

describe("TimerBar", () => {
  it("fills the share of time that is left", async () => {
    await render(<TimerBar progress={0.75} />);

    expect(screen.getByTestId("timer-fill")).toHaveStyle({ width: "75%" });
    expect(screen.getByRole("progressbar", { name: "Time left" })).toHaveAccessibilityValue({ now: 75 });
  });

  it("clamps progress outside 0..1", async () => {
    const { rerender } = await render(<TimerBar progress={1.4} />);
    expect(screen.getByTestId("timer-fill")).toHaveStyle({ width: "100%" });

    await rerender(<TimerBar progress={-0.2} />);
    expect(screen.getByTestId("timer-fill")).toHaveStyle({ width: "0%" });
  });

  it("paints the fill with the cyan to red timer gradient on the surface track", async () => {
    await render(<TimerBar progress={0.5} />);

    expect(screen.getByTestId("timer-fill")).toHaveStyle({
      experimental_backgroundImage: `linear-gradient(to right, ${gradients.timer[0]}, ${gradients.timer[1]})`,
    });
    expect(screen.getByRole("progressbar")).toHaveStyle({
      height: 4,
      backgroundColor: colors.surface,
      borderColor: colors.border,
    });
  });
});

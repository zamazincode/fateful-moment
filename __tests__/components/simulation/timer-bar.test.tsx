import { render, screen } from "@testing-library/react-native";
import { Animated } from "react-native";

import { TimerBar } from "@/components/simulation/timer-bar";
import { colors } from "@/theme";

describe("TimerBar", () => {
  it("shrinks the fill towards the middle to the share of time that is left", async () => {
    await render(<TimerBar progress={0.75} />);

    expect(screen.getByTestId("timer-fill")).toHaveStyle({ transform: [{ scaleX: 0.75 }], transformOrigin: "center" });
    expect(screen.getByRole("progressbar", { name: "Time left" })).toBeOnTheScreen();
  });

  it("clamps progress outside 0..1", async () => {
    const { rerender } = await render(<TimerBar progress={1.4} />);
    expect(screen.getByTestId("timer-fill")).toHaveStyle({ transform: [{ scaleX: 1 }] });

    await rerender(<TimerBar progress={-0.2} />);
    expect(screen.getByTestId("timer-fill")).toHaveStyle({ transform: [{ scaleX: 0 }] });
  });

  it("follows an animated value", async () => {
    const progress = new Animated.Value(0.4);
    await render(<TimerBar progress={progress} />);

    expect(screen.getByTestId("timer-fill")).toHaveStyle({ transform: [{ scaleX: 0.4 }] });
  });

  it("paints a yellow fill on the surface track", async () => {
    await render(<TimerBar progress={0.5} />);

    expect(screen.getByTestId("timer-fill")).toHaveStyle({ backgroundColor: "#FFD230" });
    expect(screen.getByRole("progressbar")).toHaveStyle({
      height: 4,
      backgroundColor: colors.surface,
      borderColor: colors.border,
    });
  });
});

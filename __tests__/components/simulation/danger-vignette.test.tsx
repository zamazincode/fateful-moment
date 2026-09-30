import { render, screen } from "@testing-library/react-native";
import { Animated } from "react-native";

import { DangerVignette } from "@/components/simulation/danger-vignette";

describe("DangerVignette", () => {
  it("is a pure red radial overlay that never takes touches", async () => {
    await render(<DangerVignette intensity={new Animated.Value(0.5)} />);

    const vignette = screen.getByTestId("danger-vignette");
    expect(vignette).toHaveStyle({ opacity: 0.5 });
    expect(vignette.props.pointerEvents).toBe("none");
    const [style] = [vignette.props.style].flat(3).filter((entry) => entry?.experimental_backgroundImage);
    expect(style.experimental_backgroundImage).toMatch(/^radial-gradient\(ellipse at center, transparent/);
    expect(style.experimental_backgroundImage).toContain("#FF0000");
  });
});

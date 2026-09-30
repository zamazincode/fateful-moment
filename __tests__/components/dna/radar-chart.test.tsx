import { fireEvent, render, screen } from "@testing-library/react-native";

import { RadarChart } from "@/components/dna/radar-chart";

const axes = [
  { label: "Vision", value: 88 },
  { label: "Courage", value: 82 },
  { label: "Risk", value: 79 },
  { label: "Control", value: 55 },
  { label: "Empathy", value: 38 },
  { label: "Ethics", value: 31 },
];

const CHART_LABEL = "Radar chart: Vision 88, Courage 82, Risk 79, Control 55, Empathy 38, Ethics 31";

async function layout(width: number, height: number) {
  await fireEvent(screen.getByLabelText(CHART_LABEL), "layout", {
    nativeEvent: { layout: { width, height, x: 0, y: 0 } },
  });
}

// react-native-svg turns the polygon into a path: "M x y x y ... z".
function valuePoints() {
  const path: string = screen.getByTestId("radar-values").props.d;
  const numbers = path.match(/-?[\d.]+(?:e-?\d+)?/g)!.map(Number);
  return Array.from({ length: numbers.length / 2 }, (_, index) => numbers.slice(index * 2, index * 2 + 2));
}

describe("RadarChart", () => {
  it("describes every axis for screen readers", async () => {
    await render(<RadarChart axes={axes} />);

    expect(screen.getByLabelText(CHART_LABEL)).toBeOnTheScreen();
  });

  it("waits for its size before drawing", async () => {
    await render(<RadarChart axes={axes} />);

    expect(screen.queryByTestId("radar-values")).toBeNull();
    expect(screen.queryByText("Vision")).toBeNull();
  });

  it("labels every axis once laid out", async () => {
    await render(<RadarChart axes={axes} />);
    await layout(200, 150);

    for (const axis of axes) {
      expect(screen.getByText(axis.label)).toBeOnTheScreen();
    }
  });

  it("plots each value along its axis, clockwise from the top", async () => {
    await render(<RadarChart axes={axes} />);
    await layout(200, 150);

    const [vision, courage, , control, , ethics] = valuePoints();
    const cx = vision[0];
    const radius = (control[1] - vision[1]) / ((88 + 55) / 100);

    // Vision straight up and Control straight down, Courage right and Ethics left of center.
    expect(control[0]).toBeCloseTo(cx);
    expect(courage[0] - cx).toBeCloseTo(radius * 0.82 * Math.cos(Math.PI / 6));
    expect(cx - ethics[0]).toBeCloseTo(radius * 0.31 * Math.cos(Math.PI / 6));
  });

  it("stretches to its row's height so it can measure the space", async () => {
    await render(<RadarChart axes={axes} />);

    expect(screen.getByLabelText(CHART_LABEL)).toHaveStyle({ alignSelf: "stretch" });
  });

  it("shrinks the chart to fit a narrow space", async () => {
    await render(<RadarChart axes={axes} />);
    await layout(200, 150);
    const wide = valuePoints();

    await layout(140, 150);
    const narrow = valuePoints();

    const spread = (points: number[][]) => points[3][1] - points[0][1];
    expect(spread(narrow)).toBeLessThan(spread(wide));
  });
});

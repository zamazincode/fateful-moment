import { fireEvent, render, screen } from "@testing-library/react-native";

import { GlassBorder, rimAxis } from "@/components/ui/glass-border";

type Node = { type: string; props: Record<string, any>; children: Node[] | null };

function findAll(node: Node | null, type: string): Node[] {
  if (!node) return [];
  const own = node.type === type ? [node] : [];
  return own.concat(...(node.children ?? []).map((child) => findAll(child, type)));
}

async function layout(width: number, height: number) {
  await fireEvent(screen.getByTestId("glass-border"), "layout", { nativeEvent: { layout: { width, height } } });
}

describe("GlassBorder", () => {
  it("draws nothing until it knows its size", async () => {
    const { toJSON } = await render(<GlassBorder radius={16} />);

    expect(findAll(toJSON() as Node, "RNSVGRect")).toHaveLength(0);
  });

  it("strokes a rounded rect with a bright-dim-bright diagonal gradient", async () => {
    const { toJSON } = await render(<GlassBorder radius={16} />);
    await layout(327, 58);

    const tree = toJSON() as Node;
    const [rect] = findAll(tree, "RNSVGRect");
    expect(rect.props).toMatchObject({ width: 326, height: 57, rx: 15.5, strokeWidth: 1 });

    const opacities = findAll(tree, "RNSVGLinearGradient")[0].props.gradient.filter(
      (_: unknown, index: number) => index % 2 === 0,
    );
    expect(opacities).toEqual([0, 0.5, 1]);
  });

  it("clamps a pill radius to half the height", async () => {
    const { toJSON } = await render(<GlassBorder radius={9999} />);
    await layout(90, 36);

    const [rect] = findAll(toJSON() as Node, "RNSVGRect");
    expect(rect.props.rx).toBe(17.5);
  });

  it("covers the host's border", async () => {
    await render(<GlassBorder radius={16} inset={2} />);

    expect(screen.getByTestId("glass-border")).toHaveStyle({ top: -2, left: -2, right: -2, bottom: -2 });
  });
});

describe("rimAxis", () => {
  // Position of a point along the gradient: 0 at the start, 1 at the end.
  function positionOf(width: number, height: number, x: number, y: number) {
    const { x1, y1, x2, y2 } = rimAxis(width, height);
    const dx = x2 - x1;
    const dy = y2 - y1;
    return ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
  }

  it.each([
    [327, 58],
    [90, 36],
    [58, 58],
  ])("lights the top-left and bottom-right corners of a %ix%i box", (width, height) => {
    expect(positionOf(width, height, 0, 0)).toBeCloseTo(0);
    expect(positionOf(width, height, width, height)).toBeCloseTo(1);
  });

  it.each([
    [327, 58],
    [90, 36],
  ])("leaves only the top-right and bottom-left corners dark on a wide %ix%i box", (width, height) => {
    expect(positionOf(width, height, width, 0)).toBeCloseTo(0.5);
    expect(positionOf(width, height, 0, height)).toBeCloseTo(0.5);
    // Edge midpoints sit halfway between a lit corner and the dark line.
    expect(positionOf(width, height, width / 2, 0)).toBeCloseTo(0.25);
    expect(positionOf(width, height, width / 2, height)).toBeCloseTo(0.75);
  });
});

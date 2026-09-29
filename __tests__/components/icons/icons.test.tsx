import { render } from "@testing-library/react-native";
import { processColor } from "react-native";

import { AppleIcon } from "@/components/icons/apple-icon";
import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { CheckCircleIcon } from "@/components/icons/check-circle-icon";
import { CheckOutlineIcon } from "@/components/icons/check-outline-icon";
import { EyeIcon } from "@/components/icons/eye-icon";
import { EyeOffIcon } from "@/components/icons/eye-off-icon";
import { GoogleIcon } from "@/components/icons/google-icon";
import { MailIcon } from "@/components/icons/mail-icon";
import { colors, palette } from "@/theme";

type Node = { type: string; props: Record<string, any>; children: Node[] | null };

// Svg host elements carry size and color on props, and react-native-svg
// stores colors as processed ARGB numbers.
function findAll(node: Node | null, type: string): Node[] {
  if (!node) return [];
  const own = node.type === type ? [node] : [];
  return own.concat(...(node.children ?? []).map((child) => findAll(child, type)));
}

async function renderIcon(element: React.ReactElement) {
  const { toJSON } = await render(element);
  const tree = toJSON() as Node;
  return { svg: tree, paths: findAll(tree, "RNSVGPath") };
}

describe("icons", () => {
  it("strokes the mail icon with the given color and size", async () => {
    const { svg, paths } = await renderIcon(<MailIcon color={colors.text} size={30} />);

    expect(svg.props).toMatchObject({ width: 30, height: 30 });
    expect(paths[0].props.stroke.payload).toBe(processColor(colors.text));
  });

  it("defaults the mail icon to the primary color", async () => {
    const { paths } = await renderIcon(<MailIcon />);

    expect(paths[0].props.stroke.payload).toBe(processColor(colors.primary));
  });

  it("fills the apple icon with white by default and with the given color", async () => {
    const byDefault = await renderIcon(<AppleIcon />);
    expect(byDefault.paths[0].props.fill.payload).toBe(processColor(palette.white));

    const tinted = await renderIcon(<AppleIcon color={colors.text} />);
    expect(tinted.paths[0].props.fill.payload).toBe(processColor(colors.text));
  });

  it.each([
    ["arrow left", ArrowLeftIcon, colors.textSecondary, "stroke"],
    ["eye", EyeIcon, colors.textMuted, "stroke"],
    ["eye off", EyeOffIcon, colors.textMuted, "stroke"],
    ["check circle", CheckCircleIcon, colors.textSecondary, "fill"],
    ["check outline", CheckOutlineIcon, colors.primary, "stroke"],
  ] as const)("paints the %s icon with its default color and a given one", async (_, Icon, defaultColor, paint) => {
    const byDefault = await renderIcon(<Icon />);
    expect(byDefault.paths.every((path) => path.props[paint].payload === processColor(defaultColor))).toBe(true);

    const tinted = await renderIcon(<Icon color={colors.primary} size={12} />);
    expect(tinted.svg.props).toMatchObject({ width: 12, height: 12 });
    expect(tinted.paths.every((path) => path.props[paint].payload === processColor(colors.primary))).toBe(true);
  });

  it("draws the four-color google logo at the given size", async () => {
    const { svg, paths } = await renderIcon(<GoogleIcon size={18} />);

    expect(svg.props).toMatchObject({ width: 18, height: 18 });
    expect(paths).toHaveLength(4);
  });
});

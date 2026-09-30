import Svg, { Path } from "react-native-svg";

import { colors } from "@/theme";

type IconProps = {
  size?: number;
  color?: string;
};

// Not in the Figma export; drawn to pair with PlayIcon: two filled bars over
// the same 2..14 height, with the same stroke width and round joins.
export function PauseIcon({ size = 16, color = colors.primary }: IconProps) {
  const paint = {
    fill: color,
    stroke: color,
    strokeWidth: 1.16492,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  } as const;

  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M4 2H6.5V14H4V2Z" {...paint} />
      <Path d="M9.5 2H12V14H9.5V2Z" {...paint} />
    </Svg>
  );
}

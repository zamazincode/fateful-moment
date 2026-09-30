import Svg, { Path } from "react-native-svg";

import { colors } from "@/theme";

type IconProps = {
  size?: number;
  color?: string;
};

// Source: Figma export (play.svg).
export function PlayIcon({ size = 16, color = colors.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M4 2L13.3333 8L4 14V2Z"
        fill={color}
        stroke={color}
        strokeWidth={1.16492}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

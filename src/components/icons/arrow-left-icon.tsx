import Svg, { Path } from "react-native-svg";

import { colors } from "@/theme";

type IconProps = {
  size?: number;
  color?: string;
};

export function ArrowLeftIcon({ size = 20, color = colors.textSecondary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 15.8337L4.16669 10.0003L10 4.16699"
        stroke={color}
        strokeWidth={1.66591}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M15.8334 10H4.16669" stroke={color} strokeWidth={1.66591} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

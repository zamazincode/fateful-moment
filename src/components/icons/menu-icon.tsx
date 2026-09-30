import Svg, { Path } from "react-native-svg";

import { colors } from "@/theme";

type IconProps = {
  size?: number;
  color?: string;
};

export function MenuIcon({ size = 20, color = colors.textSecondary }: IconProps) {
  const stroke = { stroke: color, strokeWidth: 1.66664, strokeLinecap: "round", strokeLinejoin: "round" } as const;

  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path d="M3.33325 10H16.6664" {...stroke} />
      <Path d="M3.33325 5H16.6664" {...stroke} />
      <Path d="M3.33325 15H16.6664" {...stroke} />
    </Svg>
  );
}

import Svg, { Path } from "react-native-svg";

import { colors } from "@/theme";

type IconProps = {
  size?: number;
  color?: string;
};

// Source: Figma export (playlist.svg).
export function PlaylistIcon({ size = 14, color = colors.textMuted }: IconProps) {
  const stroke = { stroke: color, strokeWidth: 1.16492, strokeLinecap: "round", strokeLinejoin: "round" } as const;

  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path d="M12.2317 8.7369V3.49475" {...stroke} />
      <Path
        d="M10.7755 10.4843C11.1617 10.4843 11.5321 10.3309 11.8051 10.0578C12.0782 9.78475 12.2316 9.41437 12.2316 9.02817C12.2316 8.64198 12.0782 8.2716 11.8051 7.99852C11.5321 7.72544 11.1617 7.57202 10.7755 7.57202C10.3893 7.57202 10.0189 7.72544 9.74583 7.99852C9.47275 8.2716 9.31934 8.64198 9.31934 9.02817C9.31934 9.41437 9.47275 9.78475 9.74583 10.0578C10.0189 10.3309 10.3893 10.4843 10.7755 10.4843Z"
        {...stroke}
      />
      <Path d="M6.98947 6.98956H1.74731" {...stroke} />
      <Path d="M9.31931 3.49475H1.74731" {...stroke} />
      <Path d="M6.98947 10.4843H1.74731" {...stroke} />
    </Svg>
  );
}

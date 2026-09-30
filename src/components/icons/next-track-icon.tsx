import Svg, { Path } from "react-native-svg";

import { colors } from "@/theme";

type IconProps = {
  size?: number;
  color?: string;
};

// Source: Figma export (next-music.svg). Drawn 16x14, so size sets the width.
export function NextTrackIcon({ size = 16, color = colors.textMuted }: IconProps) {
  const stroke = { stroke: color, strokeWidth: 1.16492, strokeLinecap: "round", strokeLinejoin: "round" } as const;

  return (
    <Svg width={size} height={(size * 14) / 16} viewBox="0 0 16 14" fill="none">
      <Path d="M3.33325 2.32983L9.99992 6.98952L3.33325 11.6492V2.32983Z" {...stroke} />
      <Path d="M12.6667 2.91229V11.0667" {...stroke} />
    </Svg>
  );
}

import Svg, { Path } from "react-native-svg";

import { colors } from "@/theme";

type IconProps = {
  size?: number;
  color?: string;
};

// Source: Figma export (back-music.svg). Drawn 16x14, so size sets the width.
export function PreviousTrackIcon({ size = 16, color = colors.textMuted }: IconProps) {
  const stroke = { stroke: color, strokeWidth: 1.16492, strokeLinecap: "round", strokeLinejoin: "round" } as const;

  return (
    <Svg width={size} height={(size * 14) / 16} viewBox="0 0 16 14" fill="none">
      <Path d="M12.6667 11.6492L6 6.98952L12.6667 2.32983V11.6492Z" {...stroke} />
      <Path d="M3.33325 11.0667V2.91229" {...stroke} />
    </Svg>
  );
}

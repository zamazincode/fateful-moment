import Svg, { Path } from "react-native-svg";

import { colors } from "@/theme";

type IconProps = {
  size?: number;
  color?: string;
};

// Source: Figma export (check-outline.svg).
export function CheckOutlineIcon({ size = 40, color = colors.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path
        d="M19.9999 36.6658C29.2045 36.6658 36.6663 29.204 36.6663 19.9994C36.6663 10.7948 29.2045 3.33301 19.9999 3.33301C10.7953 3.33301 3.3335 10.7948 3.3335 19.9994C3.3335 29.204 10.7953 36.6658 19.9999 36.6658Z"
        stroke={color}
        strokeWidth={3.33328}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.9995 19.9993L18.3328 23.3326L24.9993 16.666"
        stroke={color}
        strokeWidth={3.33328}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

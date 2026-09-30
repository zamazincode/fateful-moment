import Svg, { Path } from "react-native-svg";

import { colors } from "@/theme";

type IconProps = {
  size?: number;
  color?: string;
};

export function TargetIcon({ size = 12, color = colors.danger }: IconProps) {
  const stroke = { stroke: color, strokeWidth: 0.832839, strokeLinecap: "round", strokeLinejoin: "round" } as const;

  return (
    <Svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <Path
        d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z"
        {...stroke}
      />
      <Path
        d="M6 9C7.65685 9 9 7.65685 9 6C9 4.34315 7.65685 3 6 3C4.34315 3 3 4.34315 3 6C3 7.65685 4.34315 9 6 9Z"
        {...stroke}
      />
      <Path
        d="M6 7C6.55228 7 7 6.55228 7 6C7 5.44772 6.55228 5 6 5C5.44772 5 5 5.44772 5 6C5 6.55228 5.44772 7 6 7Z"
        {...stroke}
      />
    </Svg>
  );
}

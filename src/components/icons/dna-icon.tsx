import Svg, { Path } from "react-native-svg";

import { colors } from "@/theme";

type IconProps = {
  size?: number;
  color?: string;
};

export function DnaIcon({ size = 20, color = colors.textSecondary }: IconProps) {
  const stroke = { stroke: color, strokeWidth: 1.24208, strokeLinecap: "round", strokeLinejoin: "round" } as const;

  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path d="M8.6665 12.6665L9.6665 13.6665" {...stroke} />
      <Path d="M11.3331 7.33313L10.3331 6.33313" {...stroke} />
      <Path d="M11.9998 3.33313C10.8011 4.66513 10.3211 5.99646 10.1285 7.32846" {...stroke} />
      <Path d="M12.9998 8.99982L13.6665 9.66648" {...stroke} />
      <Path d="M13.3332 5.99984L11.4058 4.07251" {...stroke} />
      <Path d="M3.33313 11.9998C7.7778 7.99982 12.2218 11.9998 16.6665 7.99982" {...stroke} />
      <Path d="M15.3331 7.99982L15.9271 8.59382" {...stroke} />
      <Path d="M4.07251 11.4059L4.66651 11.9999" {...stroke} />
      <Path d="M6.33313 10.3331L6.9998 10.9998" {...stroke} />
      <Path d="M6.6665 13.9998L8.59384 15.9272" {...stroke} />
      <Path d="M7.99982 16.6665C9.19848 15.3345 9.67848 14.0031 9.87115 12.6711" {...stroke} />
    </Svg>
  );
}

import Svg, { Path } from "react-native-svg";

import { colors } from "@/theme";

type IconProps = {
  size?: number;
  color?: string;
};

// Source: Figma export (eye.svg).
export function EyeIcon({ size = 18, color = colors.textMuted }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Path
        d="M1.54663 9.26151C1.48413 9.09313 1.48413 8.9079 1.54663 8.73951C2.15541 7.26341 3.18877 6.00129 4.51571 5.11319C5.84265 4.22508 7.40342 3.75098 9.00013 3.75098C10.5969 3.75098 12.1576 4.22508 13.4846 5.11319C14.8115 6.00129 15.8449 7.26341 16.4536 8.73951C16.5161 8.9079 16.5161 9.09313 16.4536 9.26151C15.8449 10.7376 14.8115 11.9997 13.4846 12.8878C12.1576 13.7759 10.5969 14.2501 9.00013 14.2501C7.40342 14.2501 5.84265 13.7759 4.51571 12.8878C3.18877 11.9997 2.15541 10.7376 1.54663 9.26151Z"
        stroke={color}
        strokeWidth={1.66591}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.00009 11.2494C10.2427 11.2494 11.2501 10.242 11.2501 8.99941C11.2501 7.75677 10.2427 6.74941 9.00009 6.74941C7.75745 6.74941 6.75009 7.75677 6.75009 8.99941C6.75009 10.242 7.75745 11.2494 9.00009 11.2494Z"
        stroke={color}
        strokeWidth={1.66591}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

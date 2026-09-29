import Svg, { Path } from "react-native-svg";

import { colors } from "@/theme";

type IconProps = {
  size?: number;
  color?: string;
};

// Source: Figma export (check-circle.svg). The check is cut out of the
// circle, so it takes the color of whatever is behind the icon.
export function CheckCircleIcon({ size = 16, color = colors.textSecondary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M7.99992 1.3335C4.32658 1.3335 1.33325 4.32683 1.33325 8.00016C1.33325 11.6735 4.32658 14.6668 7.99992 14.6668C11.6733 14.6668 14.6666 11.6735 14.6666 8.00016C14.6666 4.32683 11.6733 1.3335 7.99992 1.3335ZM11.1866 6.46683L7.40658 10.2468C7.31325 10.3402 7.18658 10.3935 7.05325 10.3935C6.91992 10.3935 6.79325 10.3402 6.69992 10.2468L4.81325 8.36016C4.61992 8.16683 4.61992 7.84683 4.81325 7.6535C5.00658 7.46016 5.32658 7.46016 5.51992 7.6535L7.05325 9.18683L10.4799 5.76016C10.6733 5.56683 10.9933 5.56683 11.1866 5.76016C11.3799 5.9535 11.3799 6.26683 11.1866 6.46683Z"
        fill={color}
      />
    </Svg>
  );
}

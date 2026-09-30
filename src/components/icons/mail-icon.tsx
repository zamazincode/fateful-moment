import Svg, { Path } from "react-native-svg";

import { colors } from "@/theme";

type IconProps = {
  size?: number;
  color?: string;
};

export function MailIcon({ size = 24, color = colors.primary }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22.0006 6.99853L13.0305 12.6985C12.7218 12.892 12.3649 12.9945 12.0006 12.9945C11.6362 12.9945 11.2793 12.892 10.9706 12.6985L2.00055 6.99853M4.00055 3.99951H20.0006C21.1051 3.99951 22.0006 4.89494 22.0006 5.99951V17.9995C22.0006 19.1041 21.1051 19.9995 20.0006 19.9995H4.00055C2.89598 19.9995 2.00055 19.1041 2.00055 17.9995V5.99951C2.00055 4.89494 2.89598 3.99951 4.00055 3.99951Z"
        stroke={color}
        strokeWidth={1.66667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

import { Switch } from "react-native";

import { colors } from "@/theme";

type SettingSwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel: string;
};

export function SettingSwitch({ value, onValueChange, accessibilityLabel }: SettingSwitchProps) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: colors.borderStrong, true: colors.primaryStrong }}
      thumbColor={colors.text}
      ios_backgroundColor={colors.borderStrong}
      accessibilityLabel={accessibilityLabel}
    />
  );
}

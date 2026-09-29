import { useState } from "react";
import { StyleSheet } from "react-native";

import { EyeIcon } from "@/components/icons/eye-icon";
import { EyeOffIcon } from "@/components/icons/eye-off-icon";
import { IconButton } from "@/components/ui/icon-button";
import { TextField, type TextFieldProps } from "@/components/ui/text-field";
import { spacing } from "@/theme";

const ICON_SIZE = 18;

// TextField with a show/hide toggle.
export function PasswordField(props: Omit<TextFieldProps, "secureTextEntry" | "accessory">) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      accessory={
        <IconButton
          accessibilityLabel={visible ? "Hide password" : "Show password"}
          onPress={() => setVisible((current) => !current)}
          size={ICON_SIZE}
          hitSlop={spacing.md}
          style={styles.toggle}
        >
          {visible ? <EyeOffIcon size={ICON_SIZE} /> : <EyeIcon size={ICON_SIZE} />}
        </IconButton>
      }
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  // Bare icon inside the field, not the round surface button.
  toggle: {
    borderWidth: 0,
    backgroundColor: "transparent",
  },
});

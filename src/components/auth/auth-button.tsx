import type { ComponentProps } from "react";
import { StyleSheet } from "react-native";

import { Button } from "@/components/ui/button";
import { fonts } from "@/theme";

// The auth screens set their button labels in the regular weight, unlike the
// bold labels on the button sheet.
export function AuthButton({ textStyle, ...rest }: ComponentProps<typeof Button>) {
  return <Button textStyle={[styles.text, textStyle]} {...rest} />;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.regular,
  },
});

import { useState, type ReactNode, type Ref } from "react";
import { StyleSheet, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { colors, fonts, radius, sizes, spacing, typography } from "@/theme";

export type TextFieldProps = Omit<TextInputProps, "style"> & {
  ref?: Ref<TextInput>;
  // Shown under the field; also turns the border red.
  error?: string;
  // Red border without a message, e.g. when a checklist explains the problem.
  invalid?: boolean;
  // Icon before the text; the design only shows it while the field is empty.
  leading?: ReactNode;
  accessory?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function TextField({ ref, error, invalid, leading, accessory, style, onFocus, onBlur, value, ...rest }: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  const borderColor =
    error || invalid ? colors.danger : focused || value ? colors.primaryStrong : colors.border;

  return (
    <View style={style}>
      <View style={[styles.box, { borderColor }]}>
        {leading && !value ? <View style={styles.leading}>{leading}</View> : null}
        <TextInput
          ref={ref}
          value={value}
          style={styles.input}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.primary}
          cursorColor={colors.text}
          accessibilityLabel={rest.placeholder}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...rest}
        />
        {accessory}
      </View>
      {error ? (
        <AppText color="danger" style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    alignItems: "center",
    height: sizes.option,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
    borderWidth: 1,
    borderRadius: radius.lg,
    borderCurve: "continuous",
    backgroundColor: colors.surface,
  },
  leading: {
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    height: "100%",
    padding: 0,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: typography.body.fontSize,
  },
  // Sits in the gap below the field, so an error doesn't push the form down.
  error: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: spacing.xxs,
    fontFamily: fonts.regular,
    fontSize: typography.label.fontSize,
    lineHeight: typography.label.lineHeight,
  },
});

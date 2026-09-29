import { useId, useState } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { colors } from "@/theme";

type GlassBorderProps = {
  radius: number;
  // Width of the host's own (transparent) border, which this is drawn over.
  inset?: number;
};

// Glass rim from the Figma "Primary Glass" button: light catches the top-left
// and bottom-right corners and fades out towards the other two. Opacities are
// measured from the design screenshots.

// Gradient axis whose midpoint line runs exactly through the top-right and
// bottom-left corners, with the ends on the top-left and bottom-right corners.
// Spelled out in user space because Android doesn't skew objectBoundingBox
// gradients on wide boxes, which put the dark band across the middle.
export function rimAxis(width: number, height: number) {
  const lengthSquared = width * width + height * height;
  const along = (width * height) / lengthSquared;
  return {
    x1: width / 2 - height * along,
    y1: height / 2 - width * along,
    x2: width / 2 + height * along,
    y2: height / 2 + width * along,
  };
}

export function GlassBorder({ radius, inset = 1 }: GlassBorderProps) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const gradientId = `glass-rim-${useId()}`;

  return (
    <View
      pointerEvents="none"
      testID="glass-border"
      style={[styles.overlay, { top: -inset, left: -inset, right: -inset, bottom: -inset }]}
      onLayout={({ nativeEvent }) => setSize(nativeEvent.layout)}
    >
      {size ? (
        <Svg width={size.width} height={size.height}>
          <Defs>
            <LinearGradient id={gradientId} gradientUnits="userSpaceOnUse" {...rimAxis(size.width, size.height)}>
              <Stop offset="0" stopColor={colors.text} stopOpacity={0.6} />
              <Stop offset="0.5" stopColor={colors.text} stopOpacity={0.03} />
              <Stop offset="1" stopColor={colors.text} stopOpacity={0.45} />
            </LinearGradient>
          </Defs>
          <Rect
            x={0.5}
            y={0.5}
            width={size.width - 1}
            height={size.height - 1}
            // Pills pass radius.full; clamp it so the rim hugs the rounded ends.
            rx={Math.min(radius, size.height / 2) - 0.5}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={1}
          />
        </Svg>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
  },
});

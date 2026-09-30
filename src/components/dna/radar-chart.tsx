import { useState } from "react";
import { StyleSheet, View, type LayoutChangeEvent, type TextStyle } from "react-native";
import Svg, { Line, Polygon } from "react-native-svg";

import { AppText } from "@/components/ui/app-text";
import { colors, fonts, spacing, typography } from "@/theme";

const MAX_RADIUS = 64;
const LABEL_WIDTH = 44;
const LABEL_GAP = spacing.xxs;
const RINGS = [0.25, 0.5, 0.75, 1];

const labelStyle: TextStyle = {
  fontFamily: fonts.bold,
  fontSize: typography.caption.fontSize,
  lineHeight: typography.caption.lineHeight,
};
const LABEL_HEIGHT = labelStyle.lineHeight!;

export type RadarAxis = {
  label: string;
  // 0 to 100.
  value: number;
};

type RadarChartProps = {
  axes: RadarAxis[];
};

// Fills its container and shrinks the chart to fit the space left beside the stat grid.
export function RadarChart({ axes }: RadarChartProps) {
  const [space, setSpace] = useState<{ width: number; height: number } | null>(null);

  function measure(event: LayoutChangeEvent) {
    const { width, height } = event.nativeEvent.layout;
    setSpace({ width, height });
  }

  const radius = space
    ? Math.min(
        MAX_RADIUS,
        (space.width / 2 - LABEL_GAP - LABEL_WIDTH) / Math.cos(Math.PI / 6),
        space.height / 2 - LABEL_GAP - LABEL_HEIGHT,
      )
    : 0;

  const summary = axes.map((axis) => `${axis.label} ${axis.value}`).join(", ");

  return (
    <View style={styles.container} onLayout={measure} accessible accessibilityLabel={`Radar chart: ${summary}`}>
      {radius > 0 && <Chart axes={axes} radius={radius} />}
    </View>
  );
}

function Chart({ axes, radius }: RadarChartProps & { radius: number }) {
  const width = 2 * (radius * Math.cos(Math.PI / 6) + LABEL_GAP + LABEL_WIDTH);
  const height = 2 * (radius + LABEL_GAP + LABEL_HEIGHT);
  const cx = width / 2;
  const cy = height / 2;
  const angles = axes.map((_, index) => -Math.PI / 2 + (index * 2 * Math.PI) / axes.length);

  const point = (angle: number, distance: number) =>
    [cx + distance * Math.cos(angle), cy + distance * Math.sin(angle)] as const;
  const polygon = (distanceAt: (index: number) => number) =>
    angles.map((angle, index) => point(angle, distanceAt(index)).join(",")).join(" ");

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        {RINGS.map((ring) => (
          <Polygon
            key={ring}
            points={polygon(() => radius * ring)}
            fill="none"
            stroke={colors.border}
            strokeWidth={0.75}
          />
        ))}
        {angles.map((angle) => {
          const [x, y] = point(angle, radius);
          return <Line key={angle} x1={cx} y1={cy} x2={x} y2={y} stroke={colors.border} strokeWidth={0.75} />;
        })}
        <Polygon
          testID="radar-values"
          points={polygon((index) => (radius * axes[index].value) / 100)}
          fill={colors.primaryStrong}
          fillOpacity={0.4}
          stroke={colors.primaryStrong}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      </Svg>

      {axes.map((axis, index) => {
        const angle = angles[index];
        const [x, y] = point(angle, radius + LABEL_GAP);
        const cos = Math.cos(angle);
        const centered = Math.abs(cos) < 0.01;
        const position = centered
          ? { left: x - LABEL_WIDTH / 2, top: Math.sin(angle) < 0 ? y - LABEL_HEIGHT : y }
          : { left: cos > 0 ? x : x - LABEL_WIDTH, top: y - LABEL_HEIGHT / 2 };
        const textAlign = centered ? "center" : cos > 0 ? "left" : "right";

        return (
          <AppText
            key={axis.label}
            color="textMuted"
            numberOfLines={1}
            style={[styles.label, labelStyle, position, { textAlign }]}
          >
            {axis.label}
          </AppText>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // Stretches to the row's height: an empty box would measure 0 tall and never draw the chart.
  container: {
    flex: 1,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    position: "absolute",
    width: LABEL_WIDTH,
  },
});

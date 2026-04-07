/* eslint-disable react-native/no-inline-styles */
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import {
  Canvas,
  Path,
  Rect,
  Group,
  LinearGradient,
  Skia,
  useFont,
  Text as SkiaText,
  vec,
} from '@shopify/react-native-skia';
import { FontFamily } from '../../constants/typography';
import { useTheme } from '../../hooks';

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_VAL = 1000;
const GRID_VALUES = [1000, 500, 200, 0];
const GRADIENT_SPLIT = 350; // bottom $350 of each bar gets the gradient
const BAR_RADIUS = 8;
const BAR_DARK = '#262626';
const GRAD_TOP_COLOR = '#F6D2B3';
const GRAD_BOT_COLOR = '#3FB9A2';

const PAD_LEFT = 54;
const PAD_RIGHT = 8;
const PAD_TOP = 16;
const PAD_BOTTOM = 8;
const CANVAS_H = 220;
const CHART_H = CANVAS_H - PAD_TOP - PAD_BOTTOM; // 196
const BAR_GAP = 10;
const NUM_BARS = 7;

const BARS = [
  { value: 550 },
  { value: 780 },
  { value: 210 },
  { value: 550 },
  { value: 540 },
  { value: 350 },
  { value: 300 },
];

function yForValue(v: number) {
  return PAD_TOP + CHART_H * (1 - v / MAX_VAL);
}

// ── Component ─────────────────────────────────────────────────────────────────

interface SpendingBarChartProps {
  currentSpend?: number;
  totalBudget?: number;
  periodLabel?: string;
}

export default function SpendingBarChart({
  currentSpend = 350,
  totalBudget = 640,
  periodLabel = 'April Spendings',
}: SpendingBarChartProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const CANVAS_W = width - 40;
  const CHART_W = CANVAS_W - PAD_LEFT - PAD_RIGHT;
  const barWidth = (CHART_W - BAR_GAP * (NUM_BARS - 1)) / NUM_BARS;

  // Dashed grid line paths
  const gridLines = useMemo(() => {
    return GRID_VALUES.map((v) => {
      const y = yForValue(v);
      const p = Skia.Path.Make();
      let x = PAD_LEFT;
      const endX = PAD_LEFT + CHART_W;
      while (x < endX) {
        p.moveTo(x, y);
        p.lineTo(Math.min(x + 4, endX), y);
        x += 8;
      }
      return { p, y, label: v === 0 ? '$0' : `$${v}` };
    });
  }, [CHART_W]);

  // Bar clip paths + geometry
  const bars = useMemo(() => {
    return BARS.map((bar, i) => {
      const barX = PAD_LEFT + i * (barWidth + BAR_GAP);
      const barH = (bar.value / MAX_VAL) * CHART_H;
      const barY = yForValue(bar.value);
      const gradH = (Math.min(bar.value, GRADIENT_SPLIT) / MAX_VAL) * CHART_H;
      const gradY = PAD_TOP + CHART_H - gradH;

      const clipPath = Skia.Path.Make();
      clipPath.addRRect(
        Skia.RRectXY(Skia.XYWHRect(barX, barY, barWidth, barH), BAR_RADIUS, BAR_RADIUS),
      );
      return { barX, barY, barH, gradY, gradH, clipPath };
    });
  }, [barWidth]);

  const font = useFont(require('../../../assets/fonts/Inter_400Regular.ttf'), 11);
  if (!font) return <View style={{ height: CANVAS_H + 48 }} />;

  return (
    <View style={styles.wrapper}>
      <Canvas style={{ width: CANVAS_W, height: CANVAS_H }}>

        {/* Dashed horizontal grid lines */}
        {gridLines.map(({ p, label }) => (
          <Path key={label} path={p} style="stroke" strokeWidth={1} color={colors.border} />
        ))}

        {/* Y-axis labels */}
        {gridLines.map(({ y, label }) => {
          const textW = font.measureText(label).width;
          return (
            <SkiaText
              key={`lbl-${label}`}
              x={PAD_LEFT - textW - 6}
              y={y + 4}
              text={label}
              font={font}
              color={colors.textMuted}
            />
          );
        })}

        {/* Bars: dark top + peach→teal gradient bottom, clipped to rounded rect */}
        {bars.map(({ barX, barY, barH, gradY, gradH, clipPath }, i) => (
          <Group key={i} clip={clipPath}>
            {/* Dark upper fill (full bar, gradient will overdraw bottom) */}
            <Rect x={barX} y={barY} width={barWidth} height={barH} color={BAR_DARK} />
            {/* Gradient lower portion */}
            <Rect x={barX} y={gradY} width={barWidth} height={gradH}>
              <LinearGradient
                start={vec(barX, gradY)}
                end={vec(barX, gradY + gradH)}
                colors={[GRAD_TOP_COLOR, GRAD_BOT_COLOR]}
              />
            </Rect>
          </Group>
        ))}

      </Canvas>

      {/* Current margin row */}
      <View style={styles.marginRow}>
        <Text style={[styles.marginLabel, { color: colors.textSecondary }]}>
          Current margin: {periodLabel}
        </Text>
        <Text style={[styles.marginValue, { color: colors.textPrimary }]}>
          ${currentSpend.toFixed(2)}
          <Text style={[styles.marginSep, { color: colors.textMuted }]}> / </Text>
          <Text style={[styles.marginTotal, { color: colors.textMuted }]}>${totalBudget.toFixed(2)}</Text>
        </Text>
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    gap: 12,
  },
  marginRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  marginLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
  },
  marginValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
  },
  marginSep: {
    fontFamily: FontFamily.regular,
  },
  marginTotal: {
    fontFamily: FontFamily.regular,
  },
});

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
const GRADIENT_SPLIT = 350; 
const BAR_RADIUS = 8;
const BAR_OVERFLOW = 16; 
const BAR_DARK = '#262626';
const GRAD_TOP_COLOR = '#F6D2B3';
const GRAD_BOT_COLOR = '#3FB9A2';

const PAD_LEFT = 42;
const BAR_LEFT_OFFSET = 18;   // extra gap after y-axis so dotted lines show before bars
const PAD_RIGHT = 16;
const PAD_TOP = 16;
const PAD_BOTTOM = 8;
const CANVAS_H = 240;                             
const CHART_H = CANVAS_H - PAD_TOP - PAD_BOTTOM - BAR_OVERFLOW; 
const BAR_GAP = 24;
const NUM_BARS = 6;

const BARS = [
  { value: 550 },
  { value: 1000 },
  { value: 210 },
  { value: 550 },
  { value: 540 },
  { value: 270 },
  
];

function yForValue(v: number) {
  return PAD_TOP + CHART_H * (1 - v / MAX_VAL);
}

// Clip path with rounded top corners only (butt at bottom)
function topRoundedPath(
  x: number, y: number, w: number, h: number, r: number,
) {
  const p = Skia.Path.Make();
  p.moveTo(x, y + h);           // bottom-left
  p.lineTo(x, y + r);           // left side up
  p.quadTo(x, y, x + r, y);    // top-left arc
  p.lineTo(x + w - r, y);      // top edge
  p.quadTo(x + w, y, x + w, y + r); // top-right arc
  p.lineTo(x + w, y + h);      // right side down
  p.close();
  return p;
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
  const { colors, isDark } = useTheme();
  const barDarkColor = isDark ? BAR_DARK : '#D0D8E0';
  const { width } = useWindowDimensions();
  const CANVAS_W = width - 40;
  const CHART_W = CANVAS_W - PAD_LEFT - PAD_RIGHT;
  const BAR_AREA_W = CHART_W - BAR_LEFT_OFFSET;                          // width available for bars
  const barWidth = (BAR_AREA_W - BAR_GAP * (NUM_BARS - 1)) / NUM_BARS;

  // Dashed grid line paths — dash 8.74px, gap 6.99px, 0.44px stroke, #CCCCCC at 40% opacity
  const gridLines = useMemo(() => {
    return GRID_VALUES.map((v) => {
      const y = yForValue(v);
      const p = Skia.Path.Make();
      let x = PAD_LEFT + 8;
      const endX = PAD_LEFT + CHART_W;
      const DASH = 8.74;
      const STEP = 8.74 + 8.99;
      while (x < endX) {
        p.moveTo(x, y);
        p.lineTo(Math.min(x + DASH, endX), y);
        x += STEP;
      }
      return { p, y, label: v === 0 ? '$0' : `$${v}` };
    });
  }, [CHART_W]);

  // Bar clip paths + geometry
  const bars = useMemo(() => {
    const BAR_BOTTOM = PAD_TOP + CHART_H + BAR_OVERFLOW;
    const BAR_START_X = PAD_LEFT + BAR_LEFT_OFFSET;   // bars begin after the offset gap
    return BARS.map((bar, i) => {
      const barX = BAR_START_X + i * (barWidth + BAR_GAP);
      const barY = yForValue(bar.value);
      const barH = BAR_BOTTOM - barY;
      const gradH = (Math.min(bar.value, GRADIENT_SPLIT) / MAX_VAL) * CHART_H;
      const gradY = BAR_BOTTOM - gradH;

      const clipPath = Skia.Path.Make();
      clipPath.addRRect(
        Skia.RRectXY(Skia.XYWHRect(barX, barY, barWidth, barH), BAR_RADIUS, BAR_RADIUS),
      );
      const gradClipPath = Skia.Path.Make();
      gradClipPath.addRRect(
        Skia.RRectXY(Skia.XYWHRect(barX, gradY, barWidth, gradH), BAR_RADIUS, BAR_RADIUS),
      );
      return { barX, barY, barH, gradY, gradH, clipPath, gradClipPath };
    });
  }, [barWidth]);

  const font = useFont(require('../../../assets/fonts/Inter_400Regular.ttf'), 10);
  if (!font) return <View style={{ height: CANVAS_H + 48 }} />;

  return (
    <View style={styles.wrapper}>
      <Canvas style={{ width: CANVAS_W, height: CANVAS_H }}>

        {/* Dashed horizontal grid lines — 0.44px, #CCCCCC 40% opacity */}
        {gridLines.map(({ p, label }) => (
          <Path key={label} path={p} style="stroke" strokeWidth={0.44} color="#CCCCCC66" />
        ))}

        {/* Y-axis labels — 8.74px, #464646, 10px gap from chart */}
        {gridLines.map(({ y, label }) => {
          const textW = font.measureText(label).width;
          return (
            <SkiaText
              key={`lbl-${label}`}
              x={PAD_LEFT - textW - 10}
              y={y + 4}
              text={label}
              font={font}
              color="#464646"
            />
          );
        })}

        {/* Bars: dark top + peach→teal gradient bottom, clipped to rounded rect */}
        {bars.map(({ barX, barY, barH, gradY, gradH, clipPath, gradClipPath }, i) => (
          <Group key={i} clip={clipPath}>
            {/* Dark upper fill (full bar) */}
            <Rect x={barX} y={barY} width={barWidth} height={barH} color={barDarkColor} />
          </Group>
        ))}
        {/* Gradient fully-rounded overlay */}
        {bars.map(({ barX, gradY, gradH, gradClipPath }, i) => (
          <Group key={`g-${i}`} clip={gradClipPath}>
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
        <Text style={[styles.marginValue, { color: '#3B2C6E' }]}>
          ${currentSpend.toFixed(2)}
          <Text style={[styles.marginSep, { color: '#3B2C6E' }]}> / </Text>
          <Text style={[styles.marginTotal, { color: '#3B2C6E' }]}>${totalBudget.toFixed(2)}</Text>
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

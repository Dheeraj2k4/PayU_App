/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Canvas,
  Path,
  Skia,
  Text as SkiaText,
  useFont,
} from '@shopify/react-native-skia';
import {
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { CategoryData } from './types';
import { useTheme } from '../../hooks';
import { formatCurrency } from '../../utils/currency';

// ── Constants ─────────────────────────────────────────────────────────────────

const CANVAS_SIZE = 230;
const CX = CANVAS_SIZE / 2;
const CY = CANVAS_SIZE / 2;
const RADIUS = 82;
const STROKE_W = 28;
const BG_STROKE_W = 36;
const GAP_DEG = 24;

// ── Helpers ───────────────────────────────────────────────────────────────────

interface SliceGeo {
  startDeg: number;
  sweepDeg: number;
}

function buildSliceGeo(data: CategoryData[], total: number): SliceGeo[] {
  if (!data.length || total === 0) return [];
  const totalGap = GAP_DEG * data.length;
  const avail = 360 - totalGap;
  let angle = -90;
  return data.map((s) => {
    const sweep = (s.amount / total) * avail;
    const geo: SliceGeo = { startDeg: angle, sweepDeg: Math.max(sweep, 0) };
    angle += sweep + GAP_DEG;
    return geo;
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

interface DonutChartProps {
  slices: CategoryData[];
  total: number;
  triggerKey: string;
}

export default function DonutChart({ slices, total, triggerKey }: DonutChartProps) {
  const { colors } = useTheme();

  // Single scalar SharedValue — no complex object serialization
  const progress = useSharedValue(0);

  // Compute all arc paths on the JS thread via useMemo — no worklets needed
  const slicePaths = useMemo(() => {
    const geos = buildSliceGeo(slices, total);
    return geos.map((geo) => {
      if (geo.sweepDeg < 0.5) return null;
      const path = Skia.Path.Make();
      path.addArc(
        { x: CX - RADIUS, y: CY - RADIUS, width: RADIUS * 2, height: RADIUS * 2 },
        geo.startDeg,
        geo.sweepDeg,
      );
      return path;
    });
  }, [slices, total]);

  // Re-run the draw-on animation whenever data changes
  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerKey]);

  const bgPath = useMemo(() => {
    const p = Skia.Path.Make();
    p.addCircle(CX, CY, RADIUS);
    return p;
  }, []);

  const font = useFont(require('../../../assets/fonts/Inter_700Bold.ttf'), 22);
  const smallFont = useFont(require('../../../assets/fonts/Inter_400Regular.ttf'), 12);

  const totalText = total > 0 ? formatCurrency(total) : '';
  const subText = total > 0
    ? `${slices.length} categor${slices.length === 1 ? 'y' : 'ies'}`
    : 'No data';
  const totalTextW = font?.measureText(totalText).width ?? 0;
  const subTextW = smallFont?.measureText(subText).width ?? 0;

  if (!font || !smallFont) {
    return <View style={styles.canvas} />;
  }

  return (
    <View style={styles.wrapper}>
      <Canvas style={styles.canvas}>
        {/* Background ring */}
        <Path
          path={bgPath}
          style="stroke"
          strokeWidth={BG_STROKE_W}
          color={colors.border}
        />

        {/* Colored slices — start/end trimming drives the draw-on animation */}
        {slicePaths.map((path, i) => {
          if (!path) return null;
          return (
            <Path
              key={`slice-${i}`}
              path={path}
              style="stroke"
              strokeWidth={STROKE_W}
              strokeCap="round"
              color={slices[i].color}
              start={0}
              end={progress}
            />
          );
        })}

        {/* Center: total amount */}
        {total > 0 && (
          <SkiaText
            x={CX - totalTextW / 2}
            y={CY + 6}
            text={totalText}
            font={font}
            color={colors.textPrimary}
          />
        )}

        {/* Center: subtitle */}
        <SkiaText
          x={CX - subTextW / 2}
          y={total > 0 ? CY + 24 : CY + 6}
          text={subText}
          font={smallFont}
          color={colors.textSecondary}
        />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
  },
  canvas: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
  },
});


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
  useDerivedValue,
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

function makeArcPath(geo: SliceGeo, prog: number) {
  'worklet';
  const sweep = geo.sweepDeg * prog;
  if (sweep < 0.1) return Skia.Path.Make();
  const path = Skia.Path.Make();
  path.addArc(
    { x: CX - RADIUS, y: CY - RADIUS, width: RADIUS * 2, height: RADIUS * 2 },
    geo.startDeg,
    sweep,
  );
  return path;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface DonutChartProps {
  slices: CategoryData[];
  total: number;
  triggerKey: string;
}

export default function DonutChart({ slices, total, triggerKey }: DonutChartProps) {
  const { colors } = useTheme();

  const progress = useSharedValue(0);
  const geoData = useSharedValue<SliceGeo[]>([]);

  useEffect(() => {
    geoData.value = buildSliceGeo(slices, total);
    progress.value = 0;
    progress.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerKey]);

  const font = useFont(require('../../../assets/fonts/Inter_700Bold.ttf'), 22);
  const smallFont = useFont(require('../../../assets/fonts/Inter_400Regular.ttf'), 12);

  // Fixed-count derived paths — max 9 categories. Avoids hooks-in-loop violation.
  /* eslint-disable react-hooks/rules-of-hooks */
  const p0 = useDerivedValue(() => { const g = geoData.value[0]; return g ? makeArcPath(g, progress.value) : Skia.Path.Make(); });
  const p1 = useDerivedValue(() => { const g = geoData.value[1]; return g ? makeArcPath(g, progress.value) : Skia.Path.Make(); });
  const p2 = useDerivedValue(() => { const g = geoData.value[2]; return g ? makeArcPath(g, progress.value) : Skia.Path.Make(); });
  const p3 = useDerivedValue(() => { const g = geoData.value[3]; return g ? makeArcPath(g, progress.value) : Skia.Path.Make(); });
  const p4 = useDerivedValue(() => { const g = geoData.value[4]; return g ? makeArcPath(g, progress.value) : Skia.Path.Make(); });
  const p5 = useDerivedValue(() => { const g = geoData.value[5]; return g ? makeArcPath(g, progress.value) : Skia.Path.Make(); });
  const p6 = useDerivedValue(() => { const g = geoData.value[6]; return g ? makeArcPath(g, progress.value) : Skia.Path.Make(); });
  const p7 = useDerivedValue(() => { const g = geoData.value[7]; return g ? makeArcPath(g, progress.value) : Skia.Path.Make(); });
  const p8 = useDerivedValue(() => { const g = geoData.value[8]; return g ? makeArcPath(g, progress.value) : Skia.Path.Make(); });
  /* eslint-enable react-hooks/rules-of-hooks */

  const allPaths = [p0, p1, p2, p3, p4, p5, p6, p7, p8];

  const bgPath = useMemo(() => {
    const p = Skia.Path.Make();
    p.addCircle(CX, CY, RADIUS);
    return p;
  }, []);

  // Center labels
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

        {/* Colored animated slices */}
        {allPaths.map((path, i) => {
          const color = slices[i]?.color;
          if (!color) return null;
          return (
            <Path
              key={i}
              path={path}
              style="stroke"
              strokeWidth={STROKE_W}
              strokeCap="round"
              color={color}
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


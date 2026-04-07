/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Canvas,
  Path,
  Circle,
  Skia,
  useFont,
  Text as SkiaText,
} from '@shopify/react-native-skia';
import {
  useSharedValue,
  withTiming,
  useDerivedValue,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';
import { useTheme } from '../../hooks';

// ── Constants ─────────────────────────────────────────────────────────────────

const W = 320;
const H = 215;
const CX = W / 2;
const CY = H - 20;       // arc pivot near the bottom edge
const RADIUS = 132;
const DOT_RADIUS = RADIUS -24; // outside the arc stroke band so dots are visible
const ARC_W = 22;
const INDICATOR_R = 15;
const INDICATOR_INNER = 10;
const DOT_R = 2.5;
const NUM_DOTS = 40;
const MAX_SCORE = 900;
const START_DEG = 180;
const SWEEP_DEG = 180;

const SEGMENTS = [
  { upTo: 475, color: '#3BB9A1' },  // teal  (left)
  { upTo: 660, color: '#EE89DF' },  // pink
  { upTo: 800, color: '#74B8EF' },  // blue
  { upTo: 950, color: '#FBDE9D' },  // yellow (right)
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function degToRad(deg: number) {
  'worklet';
  return (deg * Math.PI) / 180;
}

function scoreFraction(score: number) {
  'worklet';
  return Math.min(Math.max(score, 0), MAX_SCORE) / MAX_SCORE;
}

function scoreAngleDeg(frac: number) {
  'worklet';
  return START_DEG + frac * SWEEP_DEG;
}

function scoreLabel(score: number): string {
  if (score >= 800) return 'Excellent';
  if (score >= 740) return 'Good';
  if (score >= 670) return 'Above Average';
  if (score >= 580) return 'Average';
  return 'Poor';
}

function segmentColor(score: number): string {
  for (const seg of SEGMENTS) if (score <= seg.upTo) return seg.color;
  return SEGMENTS[SEGMENTS.length - 1].color;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface CreditScoreGaugeProps {
  score?: number;
  lastCheckDate?: string;
}

export default function CreditScoreGauge({
  score = 660,
  lastCheckDate = '21 Apr',
}: CreditScoreGaugeProps) {
  const { colors } = useTheme();
  const activeColor = segmentColor(score);

  // Dotted background — small circles evenly distributed along arc
  const dotPath = useMemo(() => {
    const p = Skia.Path.Make();
    for (let i = 0; i < NUM_DOTS; i++) {
      const frac = i / (NUM_DOTS - 1);
      const rad = ((START_DEG + frac * SWEEP_DEG) * Math.PI) / 180;
      p.addCircle(CX + DOT_RADIUS * Math.cos(rad), CY + DOT_RADIUS * Math.sin(rad), DOT_R);
    }
    return p;
  }, []);

  // Faded segment arcs
  const segmentPaths = useMemo(() => {
    let prev = 0;
    return SEGMENTS.map((seg) => {
      const end = seg.upTo / MAX_SCORE;
      const startDeg = START_DEG + prev * SWEEP_DEG;
      const sweepDeg = (end - prev) * SWEEP_DEG - 10; // 6° gap between segments
      prev = end;
      const p = Skia.Path.Make();
      if (sweepDeg > 0.1) {
        p.addArc(
          { x: CX - RADIUS, y: CY - RADIUS, width: RADIUS * 2, height: RADIUS * 2 },
          startDeg,
          sweepDeg,
        );
      }
      return { path: p, color: seg.color };
    });
  }, []);

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(scoreFraction(score), {
      duration: 1400,
      easing: Easing.out(Easing.cubic),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  const indicatorCx = useDerivedValue(
    () => CX + RADIUS * Math.cos(degToRad(scoreAngleDeg(progress.value))),
  );
  const indicatorCy = useDerivedValue(
    () => CY + RADIUS * Math.sin(degToRad(scoreAngleDeg(progress.value))),
  );

  const font = useFont(require('../../../assets/fonts/Inter_700Bold.ttf'), 48);
  if (!font) return <View style={{ width: W, height: H + 60 }} />;

  const scoreStr = String(score);
  const scoreW = font.measureText(scoreStr).width;

  return (
    <View style={styles.wrapper}>
      <Canvas style={{ width: W, height: H }}>
        {/* Dotted background track */}
        <Path path={dotPath} color={colors.border} style="fill" />

        {/* Faded segment arcs (all segments always visible at low opacity) */}
        {segmentPaths.map((seg, i) => (
          <Path
            key={i}
            path={seg.path}
            style="stroke"
            strokeWidth={ARC_W}
            strokeCap="round"
            color={seg.color}
          />
        ))}

        {/* Indicator: outer glow */}
        <Circle cx={indicatorCx} cy={indicatorCy} r={INDICATOR_R} color={`${activeColor}50`} />
        {/* Indicator: white center dot — below solid fill */}
        <Circle cx={indicatorCx} cy={indicatorCy} r={5} color="#FFFFFF" />
        {/* Indicator: solid fill — on top */}
        <Circle cx={indicatorCx} cy={indicatorCy} r={INDICATOR_INNER} color={activeColor} />

        {/* Score number centered in arc */}
        <SkiaText
          x={CX - scoreW / 2}
          y={CY - 48}
          text={scoreStr}
          font={font}
          color={colors.textPrimary}
        />
      </Canvas>

      {/* Labels below canvas */}
      <Text style={[styles.label, { color: colors.textPrimary }]}>
        Your Credit Score is {scoreLabel(score)}
      </Text>
      <Text style={[styles.sub, { color: colors.textSecondary }]}>
        Last Check on {lastCheckDate}
      </Text>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    textAlign: 'center',
    marginTop: -10,
  },
  sub: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    textAlign: 'center',
  },
});

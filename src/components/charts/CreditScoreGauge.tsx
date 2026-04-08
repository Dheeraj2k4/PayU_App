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
const CY = H - 20;       
const RADIUS = 142;
const ARC_W = 22;
const BG_RADIUS = RADIUS - 24; 
const BG_ARC_W = 2;           
const LARGE_R = 16;   
const WHITE_R = 6;    
const BG_SEGMENTS = 60;
const MAX_SCORE = 900;
const START_DEG = 180;
const SWEEP_DEG = 180;

const SEGMENTS = [
  { upTo: 425, color: '#3BB9A1' },  // teal  (left)
  { upTo: 600, color: '#EE89DF' },  // pink
  { upTo: 740, color: '#74B8EF' },  // blue
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

  // 21 grey square-ended background segments on inner track
  const bgSegmentPaths = useMemo(() => {
    const GAP = 2;
    const SEG = (SWEEP_DEG - GAP * (BG_SEGMENTS - 1)) / BG_SEGMENTS;
    return Array.from({ length: BG_SEGMENTS }, (_, i) => {
      const p = Skia.Path.Make();
      p.addArc(
        { x: CX - BG_RADIUS, y: CY - BG_RADIUS, width: BG_RADIUS * 2, height: BG_RADIUS * 2 },
        START_DEG + i * (SEG + GAP),
        SEG,
      );
      return p;
    });
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

  // Radial unit vector — points outward from arc center through the arc point
  const angleRad = useDerivedValue(() => degToRad(scoreAngleDeg(progress.value)));

  const font = useFont(require('../../../assets/fonts/Inter_700Bold.ttf'), 48);
  if (!font) return <View style={{ width: W, height: H + 60 }} />;

  const scoreStr = String(score);
  const scoreW = font.measureText(scoreStr).width;

  return (
    <View style={styles.wrapper}>
      <Canvas style={{ width: W, height: H }}>
        {/* 21 grey square-ended background segments on inner track */}
        {bgSegmentPaths.map((p, i) => (
          <Path key={i} path={p} style="stroke" strokeWidth={BG_ARC_W} strokeCap="butt" color="#A1A1A1" />
        ))}

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

        {/* Indicator: large body circle — centered on arc point */}
        <Circle cx={indicatorCx} cy={indicatorCy} r={LARGE_R} color={activeColor} />
        {/* Indicator: white dot — centered inside the large circle */}
        <Circle cx={indicatorCx} cy={indicatorCy} r={WHITE_R} color="#FFFFFF" />

        {/* Score number centered in arc */}
        <SkiaText
          x={CX - scoreW / 2}
          y={CY - 10}
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
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    textAlign: 'center',
    marginTop: -10,
  },
  sub: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    textAlign: 'center',
  },
});

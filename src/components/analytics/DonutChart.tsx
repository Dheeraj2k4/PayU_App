import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedProps, withTiming, withDelay, Easing } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../../constants/theme';
import { FontFamily, Typography } from '../../constants/typography';
import { formatCurrency } from '../../utils/currency';
import { CategoryData } from './types';

const OUTER_R = 90;
const INNER_R = 58;
export const STROKE_W = OUTER_R - INNER_R;
export const MID_R = (OUTER_R + INNER_R) / 2;
export const CIRCUMFERENCE = 2 * Math.PI * MID_R;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// ── DonutSlice ────────────────────────────────────────────────────────────────

interface DonutSliceProps {
  fraction: number;
  cumulativeFraction: number;
  color: string;
  index: number;
}

function DonutSlice({ fraction, cumulativeFraction, color, index }: DonutSliceProps) {
  const sliceLength = fraction * CIRCUMFERENCE;
  const rotationDeg = cumulativeFraction * 360 - 90;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withDelay(
      index * 80,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: sliceLength * (1 - progress.value),
  }));

  if (sliceLength < 0.5) return null;

  return (
    <AnimatedCircle
      cx={OUTER_R}
      cy={OUTER_R}
      r={MID_R}
      fill="none"
      stroke={color}
      strokeWidth={STROKE_W}
      strokeDasharray={`${sliceLength} ${CIRCUMFERENCE - sliceLength}`}
      transform={`rotate(${rotationDeg} ${OUTER_R} ${OUTER_R})`}
      animatedProps={animatedProps}
    />
  );
}

// ── DonutChart ────────────────────────────────────────────────────────────────

interface DonutChartProps {
  slices: CategoryData[];
  total: number;
  triggerKey: string;
}

export default function DonutChart({ slices, total, triggerKey }: DonutChartProps) {
  if (slices.length === 0 || total === 0) {
    return (
      <View style={styles.wrap}>
        <Svg width={OUTER_R * 2} height={OUTER_R * 2}>
          <Circle
            cx={OUTER_R}
            cy={OUTER_R}
            r={MID_R}
            fill="none"
            stroke={Colors.dark.border}
            strokeWidth={STROKE_W}
          />
        </Svg>
        <View style={styles.center} pointerEvents="none">
          <Text style={styles.noData}>No data</Text>
        </View>
      </View>
    );
  }

  let cumulative = 0;
  return (
    <View style={styles.wrap}>
      <Svg width={OUTER_R * 2} height={OUTER_R * 2}>
        {slices.map((slice, i) => {
          const fraction = slice.amount / total;
          const node = (
            <DonutSlice
              key={`${triggerKey}-${slice.id}`}
              fraction={fraction}
              cumulativeFraction={cumulative}
              color={slice.color}
              index={i}
            />
          );
          cumulative += fraction;
          return node;
        })}
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <Text style={styles.total}>{formatCurrency(total)}</Text>
        <Text style={styles.label}>Total</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: OUTER_R * 2,
    height: OUTER_R * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  total: {
    ...Typography.moneyMedium,
    color: Colors.dark.textPrimary,
  },
  label: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  noData: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.dark.textMuted,
  },
});

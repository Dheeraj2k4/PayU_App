import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SemiCircleChart } from '@tubinex/react-native-charts';
import { Colors } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';
import { useTheme } from '../../hooks';

interface CreditScoreGaugeProps {
  score?: number;
  lastCheckDate?: string;
}

function scoreLabel(score: number): string {
  if (score >= 800) return 'Excellent';
  if (score >= 740) return 'Good';
  if (score >= 670) return 'Above Average';
  if (score >= 580) return 'Average';
  return 'Poor';
}

export default function CreditScoreGauge({
  score = 660,
  lastCheckDate = '21 Apr',
}: CreditScoreGaugeProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrapper}>
      <SemiCircleChart
        segments={[
          { value: 260, color: Colors.teal },
          { value: 190, color: Colors.pink },
          { value: 140, color: Colors.blue },
          { value: 100, color: Colors.yellow },
        ]}
        size={280}
        strokeWidth={36}
        segmentGap={6}
        cornerRadius={6}
        backgroundColor={colors.surfaceElevated}
        selectedSegmentIndex={1}
        selectedStrokeWidthIncrease={0}
        contentAlignment="flex-end"
        centerContent={
          <View style={styles.center}>
            <Text style={[styles.scoreText, { color: colors.textPrimary }]}>{score}</Text>
          </View>
        }
      />
      <Text style={[styles.label, { color: colors.textPrimary }]}>Your Credit Score is {scoreLabel(score)}</Text>
      <Text style={[styles.sub, { color: colors.textSecondary }]}>Last Check on {lastCheckDate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 6,
  },
  center: {
    alignItems: 'center',
    paddingBottom: 4,
  },
  scoreText: {
    fontFamily: FontFamily.bold,
    fontSize: 52,
    lineHeight: 60,
    color: Colors.dark.textPrimary,
    letterSpacing: -2,
  },
  label: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    color: Colors.dark.textPrimary,
    textAlign: 'center',
    marginTop: 4,
  },
  sub: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
});

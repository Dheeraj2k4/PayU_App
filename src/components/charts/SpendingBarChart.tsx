import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { BarChart } from '@tubinex/react-native-charts';
import { Colors } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';

const BAR_COLOR = '#3FB9A2';
const BAR_COLOR_SELECTED = '#2A9A84';

const BARS = [
  { value: 350, label: 'Mon' },
  { value: 780, label: 'Tue' },
  { value: 420, label: 'Wed' },
  { value: 460, label: 'Thu' },
  { value: 720, label: 'Fri' },
  { value: 410, label: 'Sat' },
  { value: 300, label: 'Sun' },
];

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
  const [selectedBar, setSelectedBar] = useState(-1);
  const { width } = useWindowDimensions();
  const chartWidth = width - 40;

  const data = BARS.map((b) => ({
    ...b,
    color: BAR_COLOR,
  }));

  return (
    <View style={styles.wrapper}>
      <BarChart
        data={data}
        width={chartWidth}
        height={200}
        barGap={10}
        cornerRadius={6}
        maxValue={1000}
        selectedBarIndex={selectedBar}
        selectionStyle={{ color: BAR_COLOR_SELECTED, scale: 1.06 }}
        onBarPress={(i) => setSelectedBar(i === selectedBar ? -1 : i)}
        yAxis={{
          show: true,
          labels: {
            show: true,
            formatter: (value: number | string) => `$${value}`,
            color: Colors.dark.textMuted,
            fontSize: 11,
          },
          grid: {
            show: true,
            color: Colors.dark.border,
            width: 1,
            dashArray: [4, 4],
          },
        }}
        xAxis={{
          show: false,
        }}
      />

      {/* Current margin row */}
      <View style={styles.marginRow}>
        <Text style={styles.marginLabel}>Current margin: {periodLabel}</Text>
        <Text style={styles.marginValue}>
          ${currentSpend.toFixed(2)}
          <Text style={styles.marginSep}> / </Text>
          <Text style={styles.marginTotal}>${totalBudget.toFixed(2)}</Text>
        </Text>
      </View>
    </View>
  );
}

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
    color: Colors.dark.textSecondary,
  },
  marginValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: '#5B3EAD',
  },
  marginSep: {
    color: '#5B3EAD',
  },
  marginTotal: {
    color: '#5B3EAD',
  },
});

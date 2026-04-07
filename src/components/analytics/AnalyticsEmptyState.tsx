import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';
import { Colors } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';
import { useTheme } from '../../hooks';

interface AnalyticsEmptyStateProps {
  onAdd: () => void;
}

export default function AnalyticsEmptyState({ onAdd }: AnalyticsEmptyStateProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      <Svg width={100} height={100} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="48" fill={colors.surfaceElevated} />
        <Rect x="18" y="34" width="64" height="40" rx="8" fill={colors.border} />
        <Rect x="18" y="26" width="64" height="16" rx="8" fill={colors.border} />
        <Rect x="50" y="42" width="24" height="18" rx="4" fill={`${Colors.teal}44`} />
        <Circle cx="30" cy="51" r="6" fill={`${Colors.teal}66`} />
      </Svg>
      <Text style={[styles.title, { color: colors.textPrimary }]}>No transactions yet</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {'Add your first income or expense\nto see your analytics'}
      </Text>
      <TouchableOpacity style={styles.btn} onPress={onAdd} activeOpacity={0.8}>
        <Text style={styles.btnText}>Add Transaction</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.dark.textPrimary,
    marginTop: 4,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  btn: {
    marginTop: 6,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: Colors.teal,
  },
  btnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: '#000000',
  },
});

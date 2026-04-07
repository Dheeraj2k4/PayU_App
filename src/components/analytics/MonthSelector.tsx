import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { ViewStyle } from 'react-native';
import { Colors } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';
import { useTheme } from '../../hooks';

interface MonthSelectorProps {
  monthLabel: string;
  canGoForward: boolean;
  onPrev: () => void;
  onNext: () => void;
  labelStyle: AnimatedStyle<ViewStyle>;
}

export default function MonthSelector({
  monthLabel,
  canGoForward,
  onPrev,
  onNext,
  labelStyle,
}: MonthSelectorProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={[styles.arrowBtn, { backgroundColor: colors.surfaceElevated }]}
        onPress={onPrev}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Text style={[styles.arrow, { color: colors.textPrimary }]}>‹</Text>
      </TouchableOpacity>

      <Animated.Text style={[styles.monthText, { color: colors.textPrimary }, labelStyle]}>
        {monthLabel}
      </Animated.Text>

      <TouchableOpacity
        style={[styles.arrowBtn, { backgroundColor: colors.surfaceElevated }, !canGoForward && styles.arrowDisabled]}
        onPress={onNext}
        disabled={!canGoForward}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Text style={[styles.arrow, { color: canGoForward ? colors.textPrimary : colors.textMuted }]}>›</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrowBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.dark.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowDisabled: {
    opacity: 0.28,
  },
  arrow: {
    fontFamily: FontFamily.bold,
    fontSize: 22,
    color: Colors.dark.textPrimary,
    lineHeight: 26,
  },
  arrowTextDisabled: {
    color: Colors.dark.textMuted,
  },
  monthText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
    color: Colors.dark.textPrimary,
  },
});

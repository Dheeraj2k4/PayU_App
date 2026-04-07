import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';
import { formatCurrency } from '../../utils/currency';
import { CategoryData } from './types';
import { useTheme } from '../../hooks';

const CATEGORY_ICONS: Record<string, React.ComponentProps<typeof MaterialCommunityIcons>['name']> = {
  food: 'food-fork-drink',
  travel: 'airplane',
  shopping: 'shopping',
  health: 'pill',
  entertainment: 'movie-outline',
  bills: 'receipt',
  salary: 'cash',
  investment: 'trending-up',
  other: 'dots-horizontal',
};

// ── AnimatedCategoryRow ───────────────────────────────────────────────────────

interface RowProps {
  item: CategoryData;
  amountColor: string;
}

function AnimatedCategoryRow({ item, amountColor }: RowProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const barProgress = useSharedValue(0);
  const { colors } = useTheme();

  useEffect(() => {
    barProgress.value = 0;
    barProgress.value = withDelay(
      100,
      withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedBarStyle = useAnimatedStyle(() => ({
    width: Math.max(0, barProgress.value * (item.percentage / 100) * trackWidth),
  }));

  return (
    <View style={styles.row}>
      <View style={[styles.iconWrap, { backgroundColor: `${item.color}26` }]}>
        <MaterialCommunityIcons
          name={CATEGORY_ICONS[item.id] ?? 'dots-horizontal'}
          size={20}
          color={item.color}
        />
      </View>
      <View style={styles.info}>
        <View style={styles.labelRow}>
          <View style={styles.textGroup}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>{item.label}</Text>
            <Text style={[styles.count, { color: colors.textSecondary }]}>
              {item.count} transaction{item.count !== 1 ? 's' : ''}
            </Text>
          </View>
          <Text style={[styles.amount, { color: amountColor }]}>
            {formatCurrency(item.amount)}
          </Text>
        </View>
        <View
          style={[styles.barTrack, { backgroundColor: colors.border }]}
          onLayout={(e: LayoutChangeEvent) => setTrackWidth(e.nativeEvent.layout.width)}
        >
          <Animated.View style={[styles.barFill, { backgroundColor: item.color }, animatedBarStyle]} />
        </View>
      </View>
    </View>
  );
}

// ── CategoryBreakdown ─────────────────────────────────────────────────────────

interface CategoryBreakdownProps {
  data: CategoryData[];
  activeTab: 'expenses' | 'income';
  triggerKey: string;
}

export default function CategoryBreakdown({ data, activeTab, triggerKey }: CategoryBreakdownProps) {
  const amountColor = activeTab === 'expenses' ? '#F87171' : Colors.teal;
  const { colors } = useTheme();

  if (data.length === 0) {
    return (
      <Text style={[styles.empty, { color: colors.textMuted }]}>No {activeTab} recorded this month</Text>
    );
  }

  return (
    <View style={styles.list}>
      {data.map((item) => (
        <AnimatedCategoryRow
          key={`${triggerKey}-${item.id}`}
          item={item}
          amountColor={amountColor}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  info: {
    flex: 1,
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textGroup: {
    gap: 2,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.dark.textPrimary,
  },
  count: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.dark.textSecondary,
  },
  amount: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    fontVariant: ['tabular-nums'],
  },
  barTrack: {
    height: 4,
    backgroundColor: Colors.dark.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: 4,
    borderRadius: 2,
  },
  empty: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.dark.textMuted,
    textAlign: 'center',
    paddingVertical: 16,
  },
});

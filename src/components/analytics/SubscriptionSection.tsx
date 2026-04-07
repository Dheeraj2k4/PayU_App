import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';
import { formatCurrency } from '../../utils/currency';
import { SubscriptionItem } from './types';
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

function SubscriptionRow({ item }: { item: SubscriptionItem }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <View style={[styles.iconWrap, { backgroundColor: `${item.color}26` }]}>
        <MaterialCommunityIcons
          name={CATEGORY_ICONS[item.id] ?? 'dots-horizontal'}
          size={20}
          color={item.color}
        />
      </View>
      <Text style={[styles.label, { color: colors.textPrimary }]}>{item.label}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.recurringFrequency}</Text>
      </View>
      <Text style={[styles.amount, { color: '#F87171' }]}>
        {formatCurrency(item.amount)}
      </Text>
    </View>
  );
}

interface SubscriptionSectionProps {
  subscriptions: SubscriptionItem[];
  total: number;
}

export default function SubscriptionSection({ subscriptions, total }: SubscriptionSectionProps) {
  const { colors } = useTheme();
  if (subscriptions.length === 0) {
    return <Text style={[styles.empty, { color: colors.textMuted }]}>No subscriptions tracked</Text>;
  }

  return (
    <>
      <View style={styles.list}>
        {subscriptions.map((sub) => (
          <SubscriptionRow key={sub.id} item={sub} />
        ))}
      </View>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <View style={styles.totalRow}>
        <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total</Text>
        <Text style={[styles.totalAmount, { color: colors.textPrimary }]}>{formatCurrency(total)} / mo</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 14,
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
  label: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.dark.textPrimary,
  },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: `${Colors.teal}26`,
  },
  badgeText: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: Colors.teal,
  },
  amount: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    fontVariant: ['tabular-nums'],
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.border,
    marginVertical: 14,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 15,
    color: Colors.dark.textSecondary,
  },
  totalAmount: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    color: Colors.dark.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  empty: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.dark.textMuted,
  },
});

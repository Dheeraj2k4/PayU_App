import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';
import { formatCurrency } from '../../utils/currency';
import { SubscriptionItem } from './types';
import { useTheme } from '../../hooks';
import { getServiceIcon } from '../common/ServiceIcons';
import SegmentedControl from '../common/SegmentedControl';

type Period = 'weekly' | 'monthly' | 'yearly';

const PERIODS: Period[] = ['weekly', 'monthly', 'yearly'];
const PERIOD_LABELS: Record<Period, string> = { weekly: 'Weekly', monthly: 'Monthly', yearly: 'Yearly' };
const PERIOD_SUFFIX: Record<Period, string> = { weekly: '/ wk', monthly: '/ mo', yearly: '/ yr' };

/** Normalize any frequency's amount to a monthly value */
function toMonthly(amount: number, freq: string): number {
  switch (freq.toLowerCase()) {
    case 'weekly':  return (amount * 52) / 12;
    case 'yearly': return amount / 12;
    default:        return amount; // monthly
  }
}

/** Convert a monthly amount to the target period */
function fromMonthly(monthly: number, period: Period): number {
  switch (period) {
    case 'weekly':  return (monthly * 12) / 52;
    case 'yearly': return monthly * 12;
    default:        return monthly;
  }
}

function SubscriptionRow({ item, period }: { item: SubscriptionItem; period: Period }) {
  const { colors } = useTheme();

  const convertedAmount = fromMonthly(toMonthly(item.amount, item.recurringFrequency), period);

  // Use brand colors for known services
  const l = item.label.toLowerCase();
  const iconBg = l.includes('spotify')
    ? '#1DB95422'
    : l.includes('google')
    ? '#4285F422'
    : `${item.color}26`;

  return (
    <View style={styles.row}>
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        {getServiceIcon(item.label, item.color)}
      </View>
      <Text style={[styles.label, { color: colors.textPrimary }]}>{item.label}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.recurringFrequency}</Text>
      </View>
      <Text style={[styles.amount, { color: '#F87171' }]}>
        {formatCurrency(convertedAmount)}
      </Text>
    </View>
  );
}

interface SubscriptionSectionProps {
  subscriptions: SubscriptionItem[];
}

export default function SubscriptionSection({ subscriptions }: SubscriptionSectionProps) {
  const { colors, isDark } = useTheme();
  const [period, setPeriod] = useState<Period>('monthly');

  const convertedTotal = subscriptions.reduce(
    (sum, sub) => sum + fromMonthly(toMonthly(sub.amount, sub.recurringFrequency), period),
    0,
  );

  if (subscriptions.length === 0) {
    return <Text style={[styles.empty, { color: colors.textMuted }]}>No subscriptions tracked</Text>;
  }

  return (
    <>
      {/* Period toggle */}
      <View style={[styles.toggleBox, { backgroundColor: isDark ? '#1A1A1A' : '#F2F2F2'}]}>
        <SegmentedControl
          options={PERIODS.map((p) => ({ value: p, label: PERIOD_LABELS[p] }))}
          value={period}
          onChange={setPeriod}
        />
      </View>

      <View style={styles.list}>
        {subscriptions.map((sub) => (
          <SubscriptionRow key={sub.id} item={sub} period={period} />
        ))}
      </View>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <View style={styles.totalRow}>
        <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total</Text>
        <Text style={[styles.totalAmount, { color: colors.textPrimary }]}>
          {formatCurrency(convertedTotal)} {PERIOD_SUFFIX[period]}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  toggleBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
    marginBottom: 18,
  },
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
  label: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: 14,
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
  },
  totalAmount: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    fontVariant: ['tabular-nums'],
  },
  empty: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
  },
});

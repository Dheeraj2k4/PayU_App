import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';
import { formatCurrency } from '../../utils/currency';
import { SubscriptionItem } from './types';
import { useTheme } from '../../hooks';
import { getServiceIcon } from '../common/ServiceIcons';

// ── Component ─────────────────────────────────────────────────────────────────

function SubscriptionRow({ item }: { item: SubscriptionItem }) {
  const { colors } = useTheme();

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

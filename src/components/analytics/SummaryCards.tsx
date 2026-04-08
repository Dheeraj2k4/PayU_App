import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';
import { formatCurrency } from '../../utils/currency';
import { useTheme } from '../../hooks';

interface SummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export default function SummaryCards({ totalIncome, totalExpense, balance }: SummaryCardsProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Income</Text>
        <Text style={[styles.amount, { color: colors.textPrimary }]}>
          {formatCurrency(totalIncome)}
        </Text>
      </View>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Expenses</Text>
        <Text style={[styles.amount, { color: colors.textPrimary }]}>
          {formatCurrency(totalExpense)}
        </Text>
      </View>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Balance</Text>
        <Text style={[styles.amount, { color: balance >= 0 ? Colors.teal : '#F87171' }]}>
          {formatCurrency(balance)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.dark.surface,
    borderRadius: 14,
    padding: 14,
    gap: 5,
  },
  incomeTint: {
    backgroundColor: `${Colors.income}18`,
  },
  expenseTint: {
    backgroundColor: `${Colors.expense}18`,
  },
  label: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amount: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    lineHeight: 20,
    fontVariant: ['tabular-nums'],
  },
});

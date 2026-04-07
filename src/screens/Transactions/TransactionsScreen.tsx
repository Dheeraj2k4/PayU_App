import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/theme';
import { FontFamily, Typography } from '../../constants/typography';
import { useTransactions, useTheme } from '../../hooks';
import { TransactionList } from '../../components/transactions';
import AddTransactionSheet, { AddTransactionSheetRef } from '../../components/home/AddTransactionSheet';
import FAB from '../../components/common/FAB';
import { formatCurrency } from '../../utils/currency';
import { Transaction } from '../../types';

type Filter = 'all' | 'income' | 'expense';

export default function TransactionsScreen() {
  const { transactions, deleteTransaction, currentMonthSummary } = useTransactions();
  const { colors } = useTheme();
  const sheetRef = useRef<AddTransactionSheetRef>(null);
  const [filter, setFilter] = useState<Filter>('all');

  const filtered: Transaction[] =
    filter === 'all'
      ? transactions
      : transactions.filter((t) => t.type === filter);

  const { totalIncome, totalExpenses, balance } = currentMonthSummary;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.flex}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.screenTitle, { color: colors.textPrimary }]}>Transactions</Text>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Summary cards */}
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, { borderColor: `${Colors.income}44`, backgroundColor: colors.surface }]}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Income</Text>
              <Text style={[styles.summaryAmount, { color: Colors.income }]}>
                {formatCurrency(totalIncome)}
              </Text>
            </View>
            <View style={[styles.summaryCard, { borderColor: `${Colors.expense}44`, backgroundColor: colors.surface }]}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Expenses</Text>
              <Text style={[styles.summaryAmount, { color: Colors.expense }]}>
                {formatCurrency(totalExpenses)}
              </Text>
            </View>
          </View>

          {/* Filter tabs */}
          <View style={styles.filterRow}>
            {(['all', 'income', 'expense'] as Filter[]).map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.filterChip, filter === f && styles.filterChipActive, filter !== f && { borderColor: colors.border, backgroundColor: colors.surface }]}
                onPress={() => setFilter(f)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterText, filter === f && styles.filterTextActive, filter !== f && { color: colors.textSecondary }]}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Transaction list */}
          <TransactionList
            transactions={filtered}
            onDelete={deleteTransaction}
            groupByMonth
          />
        </ScrollView>

        <FAB onPress={() => sheetRef.current?.open()} />
        <AddTransactionSheet ref={sheetRef} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  flex: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  screenTitle: {
    ...Typography.headingLarge,
    color: Colors.dark.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
    gap: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.dark.surface,
    borderRadius: 14,
    padding: 16,
    gap: 4,
    borderWidth: 1,
  },
  summaryLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  summaryAmount: {
    fontFamily: FontFamily.bold,
    fontSize: 20,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    backgroundColor: Colors.dark.surface,
  },
  filterChipActive: {
    backgroundColor: Colors.dark.textPrimary,
    borderColor: Colors.dark.textPrimary,
  },
  filterText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.dark.textSecondary,
  },
  filterTextActive: {
    color: Colors.dark.background,
  },
});


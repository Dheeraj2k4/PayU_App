import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Transaction } from '../../types';
import TransactionItem from './TransactionItem';
import { Colors } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';
import { getMonthYear, formatMonthLabel } from '../../utils/date';

interface Props {
  transactions: Transaction[];
  onDelete?: (id: string) => void;
  groupByMonth?: boolean;
}

function groupTransactionsByMonth(txs: Transaction[]): { monthYear: string; items: Transaction[] }[] {
  const map = new Map<string, Transaction[]>();
  for (const tx of txs) {
    const key = getMonthYear(tx.date);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(tx);
  }
  return Array.from(map.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([monthYear, items]) => ({ monthYear, items }));
}

export default function TransactionList({ transactions, onDelete, groupByMonth = false }: Props) {
  if (transactions.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No transactions yet</Text>
      </View>
    );
  }

  if (!groupByMonth) {
    return (
      <View style={styles.list}>
        {transactions.map((tx) => (
          <TransactionItem key={tx.id} transaction={tx} onDelete={onDelete} />
        ))}
      </View>
    );
  }

  const groups = groupTransactionsByMonth(transactions);
  return (
    <View style={styles.list}>
      {groups.map(({ monthYear, items }) => (
        <View key={monthYear}>
          <Text style={styles.monthLabel}>{formatMonthLabel(monthYear)}</Text>
          <View style={styles.group}>
            {items.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} onDelete={onDelete} />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 8,
  },
  empty: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: 15,
    color: Colors.dark.textMuted,
  },
  monthLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginBottom: 8,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  group: {
    gap: 8,
    marginBottom: 16,
  },
});


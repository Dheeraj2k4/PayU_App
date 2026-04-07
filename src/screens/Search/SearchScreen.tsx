import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTransactionContext } from '../../store';
import { Colors } from '../../constants/theme';
import { FontFamily, Typography } from '../../constants/typography';
import { formatCurrency } from '../../utils/currency';
import { formatDisplayDate } from '../../utils/date';
import { getCategoryById } from '../../constants/categories';
import { Transaction } from '../../types';
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

function TransactionRow({ tx }: { tx: Transaction }) {
  const cat = getCategoryById(tx.categoryId);
  const isIncome = tx.type === 'income';
  return (
    <View style={styles.row}>
      <View style={[styles.rowIcon, { backgroundColor: `${cat.color}20` }]}>
        <MaterialCommunityIcons
          name={CATEGORY_ICONS[tx.categoryId] ?? 'dots-horizontal'}
          size={20}
          color={cat.color}
        />
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {tx.note || cat.label}
        </Text>
        <Text style={styles.rowDate}>{formatDisplayDate(tx.date)}</Text>
      </View>
      <Text style={[styles.rowAmount, { color: isIncome ? '#3BB9A1' : '#F87171' }]}>
        {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
      </Text>
    </View>
  );
}

export default function SearchScreen() {
  const navigation = useNavigation();
  const { transactions } = useTransactionContext();
  const [query, setQuery] = useState('');
  const inputRef = useRef<TextInput>(null);
  const { colors } = useTheme();

  const results = useMemo<Transaction[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return transactions.filter((tx) => {
      const cat = getCategoryById(tx.categoryId);
      return (
        tx.note?.toLowerCase().includes(q) ||
        cat.label.toLowerCase().includes(q) ||
        tx.amount.toString().includes(q) ||
        tx.date.includes(q)
      );
    });
  }, [query, transactions]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MaterialCommunityIcons name="magnify" size={18} color={colors.textMuted} />
          <TextInput
            ref={inputRef}
            style={[styles.input, { color: colors.textPrimary }]}
            placeholder="Search transactions..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialCommunityIcons name="close-circle" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {query.trim() === '' ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="magnify" size={52} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Search your transactions</Text>
          <Text style={[styles.emptySub, { color: colors.textSecondary }]}>Type a category, note, amount or date</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="file-search-outline" size={52} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No results</Text>
          <Text style={[styles.emptySub, { color: colors.textSecondary }]}>Nothing matched "{query}"</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionRow tx={item} />}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
              {results.length} result{results.length === 1 ? '' : 's'}
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: 15,
    color: Colors.dark.textPrimary,
    padding: 0,
  },
  list: {
    padding: 16,
    gap: 2,
    paddingBottom: 60,
  },
  resultCount: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  rowIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowInfo: {
    flex: 1,
    gap: 3,
  },
  rowTitle: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.dark.textPrimary,
  },
  rowDate: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  rowAmount: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 17,
    color: Colors.dark.textPrimary,
  },
  emptySub: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
});

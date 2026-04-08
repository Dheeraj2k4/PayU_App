import React, { useRef, useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import HomeHeader from '../../components/home/HomeHeader';
import BankCard from '../../components/home/BankCard';
import ExpenseToggle, { ExpensePeriod } from '../../components/home/ExpenseToggle';
import ExpenseItem, { ExpenseItemData } from '../../components/common/ExpenseItem';
import FAB from '../../components/common/FAB';
import AddTransactionSheet, { AddTransactionSheetRef } from '../../components/home/AddTransactionSheet';
import { TransactionList } from '../../components/transactions';
import { Colors } from '../../constants/theme';
import { Typography, FontFamily } from '../../constants/typography';
import { useTransactions, useTheme } from '../../hooks';
import { formatCurrency } from '../../utils/currency';
import { useUserContext } from '../../store';

const WEEKLY_EXPENSES: ExpenseItemData[] = [
  { id: '1', category: 'FOOD',   subtitle: 'Lesser than last week', amount: '$1000', variant: 'default' },
  { id: '2', category: 'TRAVEL', subtitle: 'More than last week',   amount: '$4000', variant: 'dark-gradient' },
];
const MONTHLY_EXPENSES: ExpenseItemData[] = [
  { id: '3', category: 'FOOD',   subtitle: 'Same as last month',  amount: '$3800',  variant: 'default' },
  { id: '4', category: 'TRAVEL', subtitle: 'More than last month', amount: '$15000', variant: 'dark-gradient' },
];

export default function HomeScreen() {
  const [period, setPeriod] = useState<ExpensePeriod>('weekly');
  const [starred, setStarred] = useState<Set<string>>(new Set());
  const sheetRef = useRef<AddTransactionSheetRef>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { recentTransactions, deleteTransaction, currentMonthSummary, transactions } = useTransactions();
  const { profile } = useUserContext();
  const { colors } = useTheme();

  const notificationCount = useMemo(
    () => transactions.filter((tx) => tx.isRecurring && tx.type === 'expense').length,
    [transactions],
  );

  const expenses = period === 'weekly' ? WEEKLY_EXPENSES : MONTHLY_EXPENSES;

  const toggleStar = (id: string) => {
    setStarred((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.flex}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <HomeHeader
            notificationCount={notificationCount}
            onSearchPress={() => navigation.navigate('Search')}
            onNotificationPress={() => navigation.navigate('Notifications')}
          />

          <View style={styles.body}>
            {/* Greeting */}
            <View style={styles.greeting}>
              <Text style={[styles.greetingName, { color: colors.textPrimary }]}>Hey, {profile.name.split(' ')[0]}</Text>
              <Text style={[styles.greetingSubtitle, { color: colors.textSecondary }]}>Add your yesterday's expense</Text>
            </View>


            {/* Bank card */}
            <BankCard
              bankName="ADRBank"
              cardNumber="8763 1111 2222 0329"
              holderName="ALEX"
              expiredDate="10/28"
              variant="peach-teal"
            />

            {/* Expenses section */}
            <View style={styles.expensesHeader}>
              <Text style={[styles.expensesTitle, { color: colors.textPrimary }]}>Your expenses</Text>
            </View>

            <ExpenseToggle active={period} onChange={setPeriod} />

            {/* Expense list */}
            <View style={styles.expenseList}>
              {expenses.map((item) => (
                <ExpenseItem
                  key={item.id}
                  {...item}
                  starred={starred.has(item.id)}
                  onStarPress={toggleStar}
                />
              ))}
            </View>

            {/* Recent real transactions */}
            {recentTransactions.length > 0 && (
              <View style={styles.recentSection}>
                <Text style={[styles.expensesTitle, { color: colors.textPrimary }]}>Recent Transactions</Text>
                <TransactionList
                  transactions={recentTransactions.slice(0, 5)}
                  onDelete={deleteTransaction}
                />
              </View>
            )}
          </View>
        </ScrollView>

        {/* Floating action button */}
        <FAB onPress={() => sheetRef.current?.open()} />

        {/* Add transaction bottom sheet */}
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
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.border,
    marginHorizontal: 20,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 20,
  },
  greeting: {
    gap: 4,
  },
  greetingName: {
    ...Typography.displayLarge,
    fontSize: 20,
    color: Colors.dark.textPrimary,
  },
  greetingSubtitle: {
    ...Typography.bodyMedium,
    color: Colors.dark.textSecondary,
  },
  expensesHeader: {
    marginTop: 4,
  },
  expensesTitle: {
    ...Typography.displayLarge,
    fontSize: 16,
    lineHeight: 26,
    color: Colors.dark.textPrimary,
  },
  expenseList: {
    gap: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  miniCard: {
    flex: 1,
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    padding: 12,
    gap: 2,
    borderWidth: 1,
  },
  miniLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  miniAmount: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
  },
  recentSection: {
    gap: 12,
  },
});


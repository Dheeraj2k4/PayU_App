import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeHeader from '../../components/home/HomeHeader';
import BankCard from '../../components/home/BankCard';
import ExpenseToggle, { ExpensePeriod } from '../../components/home/ExpenseToggle';
import ExpenseItem, { ExpenseItemData } from '../../components/home/ExpenseItem';
import FAB from '../../components/home/FAB';
import { Colors } from '../../constants/theme';
import { Typography, FontFamily } from '../../constants/typography';

const WEEKLY_EXPENSES: ExpenseItemData[] = [
  {
    id: '1',
    category: 'FOOD',
    subtitle: 'Lesser than last week',
    amount: '$1000',
    variant: 'default',
  },
  {
    id: '2',
    category: 'TRAVEL',
    subtitle: 'More than last week',
    amount: '$4000',
    variant: 'dark-gradient',
  },
];

const MONTHLY_EXPENSES: ExpenseItemData[] = [
  {
    id: '3',
    category: 'FOOD',
    subtitle: 'Same as last month',
    amount: '$3800',
    variant: 'default',
  },
  {
    id: '4',
    category: 'TRAVEL',
    subtitle: 'More than last month',
    amount: '$15000',
    variant: 'dark-gradient',
  },
];

export default function HomeScreen() {
  const [period, setPeriod] = useState<ExpensePeriod>('weekly');
  const [starred, setStarred] = useState<Set<string>>(new Set());

  const expenses = period === 'weekly' ? WEEKLY_EXPENSES : MONTHLY_EXPENSES;

  const toggleStar = (id: string) => {
    setStarred((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.flex}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <HomeHeader notificationCount={2} />

          {/* Divider */}
          <View style={styles.divider} />

          <View style={styles.body}>
            {/* Greeting */}
            <View style={styles.greeting}>
              <Text style={styles.greetingName}>Hey, Alex</Text>
              <Text style={styles.greetingSubtitle}>Add your yesterday's expense</Text>
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
              <Text style={styles.expensesTitle}>Your expenses</Text>
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
          </View>
        </ScrollView>

        {/* Floating action button */}
        <FAB onPress={() => { /* TODO: navigate to add expense */ }} />
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
    ...Typography.headingLarge,
    fontSize: 26,
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
    fontFamily: FontFamily.semiBold,
    fontSize: 18,
    lineHeight: 26,
    color: Colors.dark.textPrimary,
  },
  expenseList: {
    gap: 12,
  },
});


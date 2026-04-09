import React, { useState, useMemo, useCallback, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Colors } from '../../constants/theme';
import { FontFamily, Typography } from '../../constants/typography';
import { useTransactionContext } from '../../store';
import { getCategoryById } from '../../constants/categories';
import { useTheme } from '../../hooks';
import FAB from '../../components/common/FAB';
import HomeHeader from '../../components/home/HomeHeader';
import AddTransactionSheet, { AddTransactionSheetRef } from '../../components/home/AddTransactionSheet';
import { RootStackParamList } from '../../navigation/AppNavigator';
import {
  DonutChart,
  CategoryBreakdown,
  SubscriptionSection,
  AnalyticsEmptyState,
  MonthSelector,
  SummaryCards,
  ExpenseIncomeToggle,
  CategoryData,
  SubscriptionItem,
} from '../../components/analytics';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function AnalyticsScreen() {
  const sheetRef = useRef<AddTransactionSheetRef>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { transactions } = useTransactionContext();
  const { colors } = useTheme();

  const today = new Date();
  const [selected, setSelected] = useState({ month: today.getMonth(), year: today.getFullYear() });
  const [activeTab, setActiveTab] = useState<'expenses' | 'income'>('expenses');

  // ── Animations ────────────────────────────────────────────────────────────
  const contentOpacity = useSharedValue(1);
  const contentTranslateY = useSharedValue(0);
  const monthLabelOpacity = useSharedValue(1);
  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));
  const monthLabelStyle = useAnimatedStyle(() => ({ opacity: monthLabelOpacity.value }));

  // ── Data ──────────────────────────────────────────────────────────────────
  useFocusEffect(useCallback(() => {}, []));

  const monthTransactions = useMemo(
    () => transactions.filter((tx) => {
      const d = new Date(tx.date);
      return d.getMonth() === selected.month && d.getFullYear() === selected.year;
    }),
    [transactions, selected.month, selected.year],
  );

  const incomeTransactions = useMemo(
    () => monthTransactions.filter((tx) => tx.type === 'income'),
    [monthTransactions],
  );
  const expenseTransactions = useMemo(
    () => monthTransactions.filter((tx) => tx.type === 'expense'),
    [monthTransactions],
  );

  const totalIncome = useMemo(
    () => incomeTransactions.reduce((s, tx) => s + tx.amount, 0),
    [incomeTransactions],
  );
  const totalExpense = useMemo(
    () => expenseTransactions.reduce((s, tx) => s + tx.amount, 0),
    [expenseTransactions],
  );
  const balance = totalIncome - totalExpense;

  const notificationCount = useMemo(
    () => transactions.filter((tx) => tx.isRecurring && tx.type === 'expense').length,
    [transactions],
  );

  const activeTxs = activeTab === 'expenses' ? expenseTransactions : incomeTransactions;
  const activeTotal = activeTab === 'expenses' ? totalExpense : totalIncome;

  const categoryData = useMemo<CategoryData[]>(() => {
    const map = new Map<string, { amount: number; count: number }>();
    for (const tx of activeTxs) {
      const prev = map.get(tx.categoryId) ?? { amount: 0, count: 0 };
      map.set(tx.categoryId, { amount: prev.amount + tx.amount, count: prev.count + 1 });
    }
    return Array.from(map.entries())
      .map(([id, { amount, count }]) => ({
        ...getCategoryById(id), amount, count,
        percentage: activeTotal > 0 ? (amount / activeTotal) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [activeTxs, activeTotal]);

  const subscriptions = useMemo<SubscriptionItem[]>(
    () => expenseTransactions
      .filter((tx) => tx.isRecurring)
      .map((tx) => {
        const cat = getCategoryById(tx.categoryId);
        return {
          id: tx.id,
          icon: cat.icon,
          label: tx.note?.trim() || cat.label,
          color: cat.color,
          amount: tx.amount,
          recurringFrequency: tx.recurringFrequency ?? 'monthly',
        };
      }),
    [expenseTransactions],
  );
  const subscriptionTotal = useMemo(
    () => subscriptions.reduce((s, s2) => s + s2.amount, 0),
    [subscriptions],
  );

  // ── Month navigation ──────────────────────────────────────────────────────
  const canGoForward =
    selected.year < today.getFullYear() ||
    (selected.year === today.getFullYear() && selected.month < today.getMonth());

  const applyNextMonth = useCallback((delta: number) => {
    setSelected((prev) => {
      let m = prev.month + delta;
      let y = prev.year;
      if (m < 0) { m = 11; y -= 1; }
      else if (m > 11) { m = 0; y += 1; }
      return { month: m, year: y };
    });
    contentOpacity.value = 0;
    contentTranslateY.value = delta > 0 ? 10 : -10;
    monthLabelOpacity.value = 0;
    contentOpacity.value = withTiming(1, { duration: 320 });
    contentTranslateY.value = withTiming(0, { duration: 320 });
    monthLabelOpacity.value = withTiming(1, { duration: 250 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeMonth = useCallback((delta: number) => {
    contentOpacity.value = withTiming(0, { duration: 140 }, (finished) => {
      if (finished) runOnJS(applyNextMonth)(delta);
    });
    contentTranslateY.value = withTiming(delta > 0 ? -10 : 10, { duration: 140 });
    monthLabelOpacity.value = withTiming(0, { duration: 120 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applyNextMonth]);

  const handleTabChange = useCallback((tab: 'expenses' | 'income') => {
    setActiveTab(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const monthLabel = `${MONTH_NAMES[selected.month]} ${selected.year}`;
  const triggerKey = `${selected.year}-${selected.month}-${activeTab}-${categoryData.length}-${Math.round(activeTotal)}`;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={['top']}>
      <HomeHeader
        notificationCount={notificationCount}
        onSearchPress={() => navigation.navigate('Search')}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        

        {/* Month selector */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <MonthSelector
            monthLabel={monthLabel}
            canGoForward={canGoForward}
            onPrev={() => changeMonth(-1)}
            onNext={() => { if (canGoForward) changeMonth(1); }}
            labelStyle={monthLabelStyle}
          />
        </View>

        <Animated.View style={contentStyle}>
          <SummaryCards totalIncome={totalIncome} totalExpense={totalExpense} balance={balance} />

          {monthTransactions.length === 0 ? (
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <AnalyticsEmptyState onAdd={() => sheetRef.current?.open()} />
            </View>
          ) : (
            <>
              <View style={[styles.card, { backgroundColor: colors.surface }]}>
                <ExpenseIncomeToggle
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                />
              </View>

              <View style={[styles.card, styles.donutCard, { backgroundColor: colors.surface }]}>
                <DonutChart slices={categoryData} total={activeTotal} triggerKey={triggerKey} />
              </View>

              <View style={[styles.card, { backgroundColor: colors.surface }]}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  {activeTab === 'expenses' ? 'Expenses' : 'Income'} by Category
                </Text>
                <CategoryBreakdown data={categoryData} activeTab={activeTab} triggerKey={triggerKey} />
              </View>

              {activeTab === 'expenses' && (
                <View style={[styles.card, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Subscriptions</Text>
                  <SubscriptionSection subscriptions={subscriptions} />
                </View>
              )}
            </>
          )}
        </Animated.View>
      </ScrollView>

      <FAB onPress={() => sheetRef.current?.open()} />
      <AddTransactionSheet ref={sheetRef} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 4,
    gap: 4,
  },
  title: {
    ...Typography.headingLarge,
    color: Colors.dark.textPrimary,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.dark.textSecondary,
  },
  card: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  donutCard: {
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 15,
    color: Colors.dark.textPrimary,
    marginBottom: 14,
  },
});

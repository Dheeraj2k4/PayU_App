import React, { useRef, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { AntDesign } from '@expo/vector-icons';
import ExpenseItem, { StarSvgIcon } from '../../components/common/ExpenseItem';
import { Colors } from '../../constants/theme';
import { FontFamily, Typography } from '../../constants/typography';
import HomeHeader from '../../components/home/HomeHeader';
import AddTransactionSheet, { AddTransactionSheetRef } from '../../components/home/AddTransactionSheet';
import { CreditScoreGauge, SpendingBarChart } from '../../components/charts';
import { useTransactions } from '../../hooks';
import { formatCurrency } from '../../utils/currency';
import { formatMonthLabel } from '../../utils/date';
import { useTheme } from '../../hooks';
import FAB from '../../components/common/FAB';

// ── Icons ────────────────────────────────────────────────────────────────────

function PlusSmallIcon() {
  const { colors } = useTheme();
  return (
    <AntDesign name="plus" size={14} color={colors.textPrimary} />
  );
}

// ── Currency Card helpers ──────────────────────────────────────────────────────

function FlagIcon() {
  const { colors } = useTheme();
  return (
    <View style={[styles.flagBox, { backgroundColor: colors.surfaceElevated }]}>
      <Text style={styles.flagEmoji}>🇨🇦</Text>
    </View>
  );
}

function CurrencyRight() {
  const { colors } = useTheme();
  return (
    <>
      <TouchableOpacity activeOpacity={0.7} style={styles.starBtn}>
        <StarSvgIcon />
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.7} style={[styles.enableBtn, { backgroundColor: colors.surfaceElevated }]}>
        <PlusSmallIcon />
        <Text style={[styles.enableText, { color: colors.textPrimary }]}>Enable</Text>
      </TouchableOpacity>
    </>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function BalancesScreen() {
  const { currentMonthSummary, currentMonthYear } = useTransactions();
  const { totalIncome, totalExpenses, balance } = currentMonthSummary;
  const sheetRef = useRef<AddTransactionSheetRef>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { transactions } = useTransactions();
  const notificationCount = useMemo(
    () => transactions.filter((tx) => tx.isRecurring && tx.type === 'expense').length,
    [transactions],
  );
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <HomeHeader
        notificationCount={notificationCount}
        onSearchPress={() => navigation.navigate('Search')}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Your Balances</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Manage your multi-currency accounts</Text>
        </View>

        {/* Credit Score Gauge */}
        <CreditScoreGauge score={660} lastCheckDate="21 Apr" />

        {/* Available Currencies */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Available Currencies</Text>
          <ExpenseItem
            id="cad"
            category="CAD"
            subtitle="Canadian Dollar"
            amount=""
            icon={<FlagIcon />}
            rightContent={<CurrencyRight />}
          />
        </View>

        {/* Spending Bar Chart */}
        <SpendingBarChart
          currentSpend={350}
          totalBudget={640}
          periodLabel="April Spendings"
        />
      </ScrollView>

      <FAB onPress={() => sheetRef.current?.open()} />
      <AddTransactionSheet ref={sheetRef} />
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 28,
  },

  // Title
  titleBlock: {
    gap: 4,
  },
  title: {
    ...Typography.headingLarge,
    color: Colors.dark.textPrimary,
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: Colors.dark.textSecondary,
  },

  // Section
  section: {
    gap: 14,
  },
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
    color: Colors.dark.textPrimary,
  },

  // Monthly Summary
  summarySection: {
    gap: 12,
  },
  balanceCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 20,
    gap: 6,
    alignItems: 'center',
  },
  balanceLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceAmount: {
    fontFamily: FontFamily.bold,
    fontSize: 36,
    letterSpacing: -1,
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
  summaryIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  summaryLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  summaryAmount: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
  },

  // Currency card helpers
  flagBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.dark.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagEmoji: {
    fontSize: 24,
  },
  starBtn: {
    padding: 4,
  },
  enableBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.dark.surfaceElevated,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  enableText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 12,
    color: Colors.dark.textPrimary,
  },
});



import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTransactionContext } from '../../store';
import { Colors } from '../../constants/theme';
import { FontFamily, Typography } from '../../constants/typography';
import { formatCurrency } from '../../utils/currency';
import { getCategoryById } from '../../constants/categories';
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

interface Notification {
  id: string;
  type: 'bill_due' | 'bill_overdue' | 'recurring';
  title: string;
  body: string;
  amount: number;
  daysUntilDue: number;
  color: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
}

function urgencyColor(days: number): string {
  if (days < 0) return '#F87171';   // overdue — red
  if (days <= 3) return '#FBDE9D';  // due soon — yellow
  return '#3BB9A1';                 // upcoming — teal
}

function urgencyLabel(days: number): string {
  if (days < 0) return `Overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'}`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `Due in ${days} days`;
}

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const { transactions } = useTransactionContext();
  const { colors } = useTheme();

  const notifications = useMemo<Notification[]>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return transactions
      .filter((tx) => tx.isRecurring && tx.type === 'expense')
      .map((tx) => {
        const txDate = new Date(tx.date);
        txDate.setHours(0, 0, 0, 0);

        // Project next due date based on frequency
        const next = new Date(txDate);
        while (next <= today) {
          if (tx.recurringFrequency === 'weekly') next.setDate(next.getDate() + 7);
          else if (tx.recurringFrequency === 'yearly') next.setFullYear(next.getFullYear() + 1);
          else next.setMonth(next.getMonth() + 1); // monthly default
        }

        const daysUntil = Math.round((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const cat = getCategoryById(tx.categoryId);

        return {
          id: tx.id,
          type: daysUntil < 0 ? 'bill_overdue' : 'bill_due',
          title: tx.note || cat.label,
          body: `${tx.recurringFrequency ?? 'monthly'} · ${urgencyLabel(daysUntil)}`,
          amount: tx.amount,
          daysUntilDue: daysUntil,
          color: urgencyColor(daysUntil),
          icon: CATEGORY_ICONS[tx.categoryId] ?? 'receipt',
        } as Notification;
      })
      .sort((a, b) => a.daysUntilDue - b.daysUntilDue);
  }, [transactions]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Notifications</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <View style={styles.empty}>
            <MaterialCommunityIcons name="bell-outline" size={56} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>All clear!</Text>
            <Text style={[styles.emptySub, { color: colors.textSecondary }]}>No upcoming bills or subscriptions.</Text>
          </View>
        ) : (
          <>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Upcoming Bills</Text>
            {notifications.map((n) => (
              <View key={n.id} style={[styles.card, { borderLeftColor: n.color, backgroundColor: colors.surface }]}>
                <View style={[styles.iconBox, { backgroundColor: `${n.color}20` }]}>
                  <MaterialCommunityIcons name={n.icon} size={22} color={n.color} />
                </View>
                <View style={styles.info}>
                  <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{n.title}</Text>
                  <Text style={[styles.cardBody, { color: n.color }]}>{n.body}</Text>
                </View>
                <Text style={styles.amount}>{formatCurrency(n.amount)}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.headingMedium,
    color: Colors.dark.textPrimary,
  },
  scroll: {
    padding: 20,
    gap: 12,
    paddingBottom: 60,
  },
  sectionLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: 13,
    color: Colors.dark.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.dark.surface,
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 3,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 3,
  },
  cardTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.dark.textPrimary,
  },
  cardBody: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
  },
  amount: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.dark.textPrimary,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: 18,
    color: Colors.dark.textPrimary,
  },
  emptySub: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
});

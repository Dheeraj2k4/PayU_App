import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTransactionContext } from '../../store';
import { Colors } from '../../constants/theme';
import { FontFamily, Typography } from '../../constants/typography';
import { formatCurrency } from '../../utils/currency';
import { getCategoryById } from '../../constants/categories';
import { useTheme } from '../../hooks';
import { getServiceIcon, BillsIcon } from '../../components/common/ServiceIcons';

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
  categoryId: string;
  isRecurring: boolean;
}

function urgencyColor(days: number): string {
  if (days < 0) return '#F87171';
  if (days <= 3) return '#FBDE9D';
  return '#3BB9A1';
}

function urgencyLabel(days: number): string {
  if (days < 0) return `Overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'}`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `Due in ${days} days`;
}

function DeleteAction({ progress }: { progress: Animated.AnimatedInterpolation<number> }) {
  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });
  return (
    <View style={styles.deleteAction}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <MaterialCommunityIcons name="trash-can-outline" size={26} color="#fff" />
      </Animated.View>
    </View>
  );
}

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const { transactions, deleteTransaction } = useTransactionContext();
  const { colors } = useTheme();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const notifications = useMemo<Notification[]>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return transactions
      .filter((tx) => tx.isRecurring && tx.type === 'expense' && !dismissed.has(tx.id))
      .map((tx) => {
        const txDate = new Date(tx.date);
        txDate.setHours(0, 0, 0, 0);
        const next = new Date(txDate);
        while (next <= today) {
          if (tx.recurringFrequency === 'weekly') next.setDate(next.getDate() + 7);
          else if (tx.recurringFrequency === 'yearly') next.setFullYear(next.getFullYear() + 1);
          else next.setMonth(next.getMonth() + 1);
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
          categoryId: tx.categoryId,
          isRecurring: !!tx.isRecurring,
        } as Notification;
      })
      .sort((a, b) => a.daysUntilDue - b.daysUntilDue);
  }, [transactions, dismissed]);

  const handleDismiss = useCallback((id: string) => {
    setDismissed((prev) => new Set([...prev, id]));
  }, []);

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
            {notifications.map((n) => {
              const iconEl = n.isRecurring
                ? getServiceIcon(n.title, n.color, 22)
                : n.categoryId === 'bills'
                  ? <BillsIcon size={22} color={n.color} />
                  : <MaterialCommunityIcons name={CATEGORY_ICONS[n.categoryId] ?? 'receipt'} size={22} color={n.color} />;

              return (
                <Swipeable
                  key={n.id}
                  friction={2}
                  leftThreshold={60}
                  rightThreshold={60}
                  renderLeftActions={(p) => <DeleteAction progress={p} />}
                  renderRightActions={(p) => <DeleteAction progress={p} />}
                  onSwipeableOpen={() => handleDismiss(n.id)}
                >
                  <View style={[styles.card, { backgroundColor: colors.surface }]}>
                    <View style={[styles.iconBox, { backgroundColor: `${n.color}22` }]}>
                      {iconEl}
                    </View>
                    <View style={styles.info}>
                      <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{n.title}</Text>
                      <Text style={[styles.cardBody, { color: colors.textSecondary }]}>{n.body}</Text>
                    </View>
                    <View style={[styles.amountBadge, { backgroundColor: colors.surfaceElevated }]}>
                      <Text style={[styles.amountText, { color: n.color }]}>{formatCurrency(n.amount)}</Text>
                    </View>
                  </View>
                </Swipeable>
              );
            })}
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
    gap: 12,
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 3,
  },
  cardTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.3,
    color: Colors.dark.textPrimary,
  },
  cardBody: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  amountBadge: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  amountText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
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
  deleteAction: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});

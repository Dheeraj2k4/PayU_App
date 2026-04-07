import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Transaction } from '../../types';
import { getCategoryById } from '../../constants/categories';
import { formatAmount } from '../../utils/currency';
import { Colors } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';
import { useTheme } from '../../hooks';

// ─── Category icon map (same as AddTransactionSheet) ─────────────────────────

const CATEGORY_ICONS: Record<string, React.ComponentProps<typeof MaterialCommunityIcons>['name']> = {
  food:          'food-fork-drink',
  travel:        'airplane',
  shopping:      'shopping',
  health:        'pill',
  entertainment: 'movie-outline',
  bills:         'receipt',
  salary:        'cash',
  investment:    'trending-up',
  other:         'dots-horizontal',
};

// ─── Delete action background ─────────────────────────────────────────────────

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

// ─── TransactionItem ──────────────────────────────────────────────────────────

interface Props {
  transaction: Transaction;
  onDelete?: (id: string) => void;
}

export default function TransactionItem({ transaction, onDelete }: Props) {
  const { colors } = useTheme();
  const swipeableRef = useRef<Swipeable>(null);
  const cat = getCategoryById(transaction.categoryId);
  const isIncome = transaction.type === 'income';
  const iconName = CATEGORY_ICONS[transaction.categoryId] ?? 'dots-horizontal';
  const label = transaction.note?.trim() || cat.label;
  const subtitle = isIncome ? 'Income' : 'Expense';

  const handleSwipeOpen = () => {
    if (onDelete) {
      // brief delay so the swipe animation completes visually
      setTimeout(() => onDelete(transaction.id), 80);
    }
  };

  const renderAction = (progress: Animated.AnimatedInterpolation<number>) => (
    <DeleteAction progress={progress} />
  );

  const cardContent = (
    <View style={styles.inner}>
      {/* Icon */}
      <View style={[styles.iconWrapper, { backgroundColor: `${cat.color}22` }]}>
        <MaterialCommunityIcons name={iconName} size={22} color={cat.color} />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={[styles.category, { color: colors.textPrimary }]} numberOfLines={1}>{label}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      </View>

      {/* Amount badge */}
      <View style={[styles.amountBadge, { backgroundColor: colors.surfaceElevated }]}>
        <Text style={[styles.amountText, { color: isIncome ? Colors.income : Colors.expense }]}>
          {formatAmount(transaction.amount, transaction.type)}
        </Text>
      </View>
    </View>
  );

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      leftThreshold={60}
      rightThreshold={60}
      renderLeftActions={(progress) => renderAction(progress)}
      renderRightActions={(progress) => renderAction(progress)}
      onSwipeableOpen={handleSwipeOpen}
    >
      {isIncome ? (
        <LinearGradient
          colors={['#192D29', '#262626', '#0A0A0A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          {cardContent}
        </LinearGradient>
      ) : (
        <View style={[styles.card, { backgroundColor: colors.surface }]}>{cardContent}</View>
      )}
    </Swipeable>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
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
  category: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  subtitle: {
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
  deleteAction: {
    flex: 1,
    borderRadius: 16,
    marginVertical: 0,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});



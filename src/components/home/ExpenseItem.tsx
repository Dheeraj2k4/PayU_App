import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Polygon } from 'react-native-svg';
import { Colors } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';

function CategoryIcon() {
  // Circular dark icon matching the image — two overlapping circles like a coin/card logo
  return (
    <View style={styles.iconWrapper}>
      <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
        <Circle cx={11} cy={14} r={8} fill="rgba(255,255,255,0.9)" />
        <Circle cx={17} cy={14} r={8} fill="rgba(255,255,255,0.45)" />
      </Svg>
    </View>
  );
}

function StarIcon({ filled = false }: { filled?: boolean }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        stroke={Colors.dark.iconMuted}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? Colors.yellow : 'none'}
      />
    </Svg>
  );
}

export interface ExpenseItemData {
  id: string;
  category: string;
  subtitle: string;
  amount: string;
  starred?: boolean;
  /** 'default' uses dark surface, 'dark-gradient' uses #192D29→#262626→#0A0A0A */
  variant?: 'default' | 'dark-gradient';
}

interface ExpenseItemProps extends ExpenseItemData {
  onStarPress?: (id: string) => void;
}

export default function ExpenseItem({
  id,
  category,
  subtitle,
  amount,
  starred = false,
  variant = 'default',
  onStarPress,
}: ExpenseItemProps) {
  const content = (
    <View style={styles.inner}>
      <CategoryIcon />
      <View style={styles.info}>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <TouchableOpacity
        onPress={() => onStarPress?.(id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        activeOpacity={0.7}
      >
        <StarIcon filled={starred} />
      </TouchableOpacity>
      <View style={styles.amountBadge}>
        <Text style={styles.amountText}>{amount}</Text>
      </View>
    </View>
  );

  if (variant === 'dark-gradient') {
    return (
      <LinearGradient
        colors={['#192D29', '#262626', '#0A0A0A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {content}
      </LinearGradient>
    );
  }

  return <View style={[styles.card, styles.defaultCard]}>{content}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  defaultCard: {
    backgroundColor: Colors.dark.surface,
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
    backgroundColor: Colors.dark.surfaceElevated,
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
    color: Colors.dark.textPrimary,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.dark.textSecondary,
  },
  amountBadge: {
    backgroundColor: Colors.dark.surfaceElevated,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  amountText: {
    fontFamily: FontFamily.semiBold,
    fontSize: 14,
    color: Colors.dark.textPrimary,
  },
});

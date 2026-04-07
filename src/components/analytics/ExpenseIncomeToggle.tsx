import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { ViewStyle } from 'react-native';
import { Colors } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';
import { useTheme } from '../../hooks';

interface ExpenseIncomeToggleProps {
  activeTab: 'expenses' | 'income';
  onTabChange: (tab: 'expenses' | 'income') => void;
  pillStyle: AnimatedStyle<ViewStyle>;
  onContainerLayout: (width: number) => void;
}

export default function ExpenseIncomeToggle({
  activeTab,
  onTabChange,
  pillStyle,
  onContainerLayout,
}: ExpenseIncomeToggleProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[styles.container, { backgroundColor: colors.surfaceElevated }]}
      onLayout={(e) => onContainerLayout(e.nativeEvent.layout.width)}
    >
      <Animated.View style={[styles.pill, pillStyle]} />
      <TouchableOpacity
        style={styles.option}
        onPress={() => onTabChange('expenses')}
        activeOpacity={0.8}
      >
        <Text style={[styles.text, { color: colors.textSecondary }, activeTab === 'expenses' && styles.textActive]}>
          Expenses
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.option}
        onPress={() => onTabChange('income')}
        activeOpacity={0.8}
      >
        <Text style={[styles.text, { color: colors.textSecondary }, activeTab === 'income' && styles.textActive]}>
          Income
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.surfaceElevated,
    borderRadius: 999,
    padding: 4,
    height: 44,
  },
  pill: {
    position: 'absolute',
    top: 4,
    left: 4,
    bottom: 4,
    borderRadius: 999,
    backgroundColor: Colors.teal,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  text: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  textActive: {
    fontFamily: FontFamily.semiBold,
    color: Colors.dark.background,
  },
});

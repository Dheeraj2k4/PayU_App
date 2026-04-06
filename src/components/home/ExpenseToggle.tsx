import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';

export type ExpensePeriod = 'weekly' | 'monthly';

interface ExpenseToggleProps {
  active: ExpensePeriod;
  onChange: (period: ExpensePeriod) => void;
}

export default function ExpenseToggle({ active, onChange }: ExpenseToggleProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.tab, active === 'weekly' && styles.activeTab]}
        onPress={() => onChange('weekly')}
      >
        <Text style={[styles.tabText, active === 'weekly' && styles.activeTabText]}>
          Weekly
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.tab, active === 'monthly' && styles.activeTab]}
        onPress={() => onChange('monthly')}
      >
        <Text style={[styles.tabText, active === 'monthly' && styles.activeTabText]}>
          Monthly
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.surface,
    borderRadius: 30,
    padding: 4,
  },
  tab: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
  },
  activeTab: {
    backgroundColor: Colors.light.background,
  },
  tabText: {
    fontFamily: FontFamily.medium,
    fontSize: 15,
    color: Colors.dark.textSecondary,
  },
  activeTabText: {
    fontFamily: FontFamily.semiBold,
    color: Colors.dark.background,
  },
});

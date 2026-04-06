import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';

export type AuthTab = 'sign-in' | 'sign-up';

interface AuthTabSwitcherProps {
  activeTab: AuthTab;
  onTabChange: (tab: AuthTab) => void;
}

export default function AuthTabSwitcher({
  activeTab,
  onTabChange,
}: AuthTabSwitcherProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.tab, activeTab === 'sign-in' && styles.activeTab]}
        onPress={() => onTabChange('sign-in')}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'sign-in' && styles.activeTabText,
          ]}
        >
          Sign In
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.tab, activeTab === 'sign-up' && styles.activeTab]}
        onPress={() => onTabChange('sign-up')}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'sign-up' && styles.activeTabText,
          ]}
        >
          Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.background,
    borderRadius: 22,
    padding: 4,
  },
  tab: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
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

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';
import { FontFamily } from '../../constants/typography';

export type ProfileTab = 'preview' | 'edit';

interface ProfileTabSwitcherProps {
  active: ProfileTab;
  onChange: (tab: ProfileTab) => void;
}

export default function ProfileTabSwitcher({ active, onChange }: ProfileTabSwitcherProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.tab, active === 'preview' && styles.activeTab]}
        onPress={() => onChange('preview')}
      >
        <Text style={[styles.tabText, active === 'preview' && styles.activeTabText]}>
          Preview
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.tab, active === 'edit' && styles.activeTab]}
        onPress={() => onChange('edit')}
      >
        <Text style={[styles.tabText, active === 'edit' && styles.activeTabText]}>
          Edit
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

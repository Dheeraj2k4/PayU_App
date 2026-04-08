import React from 'react';
import SegmentedControl from '../common/SegmentedControl';
import { Colors } from '../../constants/theme';
import { useTheme } from '../../hooks';

export type AuthTab = 'sign-in' | 'sign-up';

const OPTIONS = [
  { value: 'sign-in' as const, label: 'Sign In' },
  { value: 'sign-up' as const, label: 'Sign Up' },
];

interface AuthTabSwitcherProps {
  activeTab: AuthTab;
  onTabChange: (tab: AuthTab) => void;
}

export default function AuthTabSwitcher({ activeTab, onTabChange }: AuthTabSwitcherProps) {
  const { isDark } = useTheme();
  return (
    <SegmentedControl
      options={OPTIONS}
      value={activeTab}
      onChange={onTabChange}
      trackColor={isDark ? '#262626' : Colors.light.background}
      pillColor={isDark ? Colors.light.background : Colors.dark.background}
      activeTextColor={isDark ? Colors.dark.background : Colors.light.background}
    />
  );
}

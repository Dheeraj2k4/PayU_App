import React from 'react';
import SegmentedControl from '../common/SegmentedControl';
import { useTheme } from '../../hooks';

const OPTIONS = [
  { value: 'expenses' as const, label: 'Expenses' },
  { value: 'income'   as const, label: 'Income'   },
];

interface ExpenseIncomeToggleProps {
  activeTab: 'expenses' | 'income';
  onTabChange: (tab: 'expenses' | 'income') => void;
  /** @deprecated kept for API compat — no longer used */
  pillStyle?: any;
  /** @deprecated kept for API compat — no longer used */
  onContainerLayout?: (width: number) => void;
}

export default function ExpenseIncomeToggle({
  activeTab,
  onTabChange,
}: ExpenseIncomeToggleProps) {
  const { colors } = useTheme();
  return (
    <SegmentedControl
      options={OPTIONS}
      value={activeTab}
      onChange={onTabChange}
      trackColor={colors.surfaceElevated}
    />
  );
}

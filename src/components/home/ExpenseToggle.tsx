import React from 'react';
import SegmentedControl from '../common/SegmentedControl';
import { useTheme } from '../../hooks';

export type ExpensePeriod = 'weekly' | 'monthly';

const OPTIONS = [
  { value: 'weekly'  as const, label: 'Weekly'  },
  { value: 'monthly' as const, label: 'Monthly' },
];

interface ExpenseToggleProps {
  active: ExpensePeriod;
  onChange: (period: ExpensePeriod) => void;
}

export default function ExpenseToggle({ active, onChange }: ExpenseToggleProps) {
  const { colors } = useTheme();
  return (
    <SegmentedControl
      options={OPTIONS}
      value={active}
      onChange={onChange}
      trackColor={colors.surface}
    />
  );
}

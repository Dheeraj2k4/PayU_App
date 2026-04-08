import React from 'react';
import SegmentedControl from '../common/SegmentedControl';

export type ProfileTab = 'preview' | 'edit';

const OPTIONS = [
  { value: 'preview' as const, label: 'Preview' },
  { value: 'edit'    as const, label: 'Edit'    },
];

interface ProfileTabSwitcherProps {
  active: ProfileTab;
  onChange: (tab: ProfileTab) => void;
}

export default function ProfileTabSwitcher({ active, onChange }: ProfileTabSwitcherProps) {
  return (
    <SegmentedControl
      options={OPTIONS}
      value={active}
      onChange={onChange}
    />
  );
}

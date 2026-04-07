import { Category } from '../types/category';

export const PREDEFINED_CATEGORIES: Category[] = [
  { id: 'food',          label: 'Food',          icon: '🍔', color: '#FBDE9D' },
  { id: 'travel',        label: 'Travel',        icon: '✈️',  color: '#74B8EF' },
  { id: 'shopping',      label: 'Shopping',      icon: '🛍️',  color: '#EE89DF' },
  { id: 'health',        label: 'Health',        icon: '💊', color: '#3BB9A1' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: '#A78BFA' },
  { id: 'bills',         label: 'Bills',         icon: '🧾', color: '#F87171' },
  { id: 'salary',        label: 'Salary',        icon: '💰', color: '#3BB9A1' },
  { id: 'investment',    label: 'Investment',    icon: '📈', color: '#74B8EF' },
  { id: 'other',         label: 'Other',         icon: '📦', color: '#999999' },
];

export function getCategoryById(id: string): Category {
  return (
    PREDEFINED_CATEGORIES.find((c) => c.id === id) ??
    { id, label: id, icon: '📦', color: '#999999' }
  );
}

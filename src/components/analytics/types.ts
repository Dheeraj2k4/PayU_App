export interface CategoryData {
  id: string;
  label: string;
  icon: string;
  color: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface SubscriptionItem {
  id: string;
  icon: string;
  label: string;
  color: string;
  amount: number;
  recurringFrequency: string;
}

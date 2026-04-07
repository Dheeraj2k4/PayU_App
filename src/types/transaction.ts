export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  date: string; // ISO date string YYYY-MM-DD
  note: string;
  createdAt: number; // timestamp ms
  isRecurring?: boolean;
  recurringFrequency?: string; // e.g. 'monthly', 'weekly', 'yearly'
}

import { useMemo } from 'react';
import { useTransactionContext } from '../store';
import { getMonthYear } from '../utils/date';
import { todayISO } from '../utils/date';

export function useTransactions() {
  const ctx = useTransactionContext();

  const currentMonthYear = useMemo(() => getMonthYear(todayISO()), []);

  const currentMonthSummary = useMemo(
    () => ctx.getMonthlySummary(currentMonthYear),
    [ctx, currentMonthYear],
  );

  const currentMonthTransactions = useMemo(
    () => ctx.getTransactionsForMonth(currentMonthYear),
    [ctx, currentMonthYear],
  );

  const recentTransactions = useMemo(
    () => ctx.transactions.slice(0, 20),
    [ctx.transactions],
  );

  return {
    ...ctx,
    currentMonthYear,
    currentMonthSummary,
    currentMonthTransactions,
    recentTransactions,
  };
}

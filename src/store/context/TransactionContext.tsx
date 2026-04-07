import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { Transaction, TransactionType } from '../../types';
import { loadTransactions, saveTransactions } from '../../utils/storage';
import { getMonthYear } from '../../utils/date';

// ── State ─────────────────────────────────────────────────────────────────────

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
}

type Action =
  | { type: 'LOADED'; payload: Transaction[] }
  | { type: 'ADD'; payload: Transaction }
  | { type: 'DELETE'; payload: string };

function reducer(state: TransactionState, action: Action): TransactionState {
  switch (action.type) {
    case 'LOADED':
      return { ...state, transactions: action.payload, loading: false };
    case 'ADD':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'DELETE':
      return { ...state, transactions: state.transactions.filter((t) => t.id !== action.payload) };
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

export interface MonthlySummary {
  monthYear: string;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

interface TransactionContextValue {
  transactions: Transaction[];
  loading: boolean;
  addTransaction: (data: Omit<Transaction, 'id' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;
  getMonthlySummary: (monthYear: string) => MonthlySummary;
  getTransactionsForMonth: (monthYear: string) => Transaction[];
}

const TransactionContext = createContext<TransactionContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { transactions: [], loading: true });

  useEffect(() => {
    loadTransactions().then((data) => dispatch({ type: 'LOADED', payload: data }));
  }, []);

  // Persist whenever transactions change (skip initial loading state)
  useEffect(() => {
    if (!state.loading) {
      saveTransactions(state.transactions);
    }
  }, [state.transactions, state.loading]);

  const addTransaction = useCallback((data: Omit<Transaction, 'id' | 'createdAt'>) => {
    const tx: Transaction = {
      ...data,
      id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
    };
    dispatch({ type: 'ADD', payload: tx });
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    dispatch({ type: 'DELETE', payload: id });
  }, []);

  const getTransactionsForMonth = useCallback(
    (monthYear: string) =>
      state.transactions.filter((t) => getMonthYear(t.date) === monthYear),
    [state.transactions],
  );

  const getMonthlySummary = useCallback(
    (monthYear: string): MonthlySummary => {
      const txs = state.transactions.filter((t) => getMonthYear(t.date) === monthYear);
      const totalIncome = txs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const totalExpenses = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      return { monthYear, totalIncome, totalExpenses, balance: totalIncome - totalExpenses };
    },
    [state.transactions],
  );

  return (
    <TransactionContext.Provider
      value={{
        transactions: state.transactions,
        loading: state.loading,
        addTransaction,
        deleteTransaction,
        getMonthlySummary,
        getTransactionsForMonth,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactionContext() {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error('useTransactionContext must be used inside TransactionProvider');
  return ctx;
}

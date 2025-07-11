
import { Expense } from '@/models/types';

const API_BASE = 'http://localhost:5000/api/expenses';

export const fetchExpenses = async (): Promise<Expense[]> => {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch expenses');
  return res.json();
};

export const fetchExpenseById = async (id: string): Promise<Expense> => {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch expense');
  return res.json();
};

export const createExpense = async (expense: Partial<Expense>): Promise<Expense> => {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense),
  });
  if (!res.ok) throw new Error('Failed to create expense');
  return res.json();
};

export const updateExpense = async (id: string, expense: Partial<Expense>): Promise<Expense> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense),
  });
  if (!res.ok) throw new Error('Failed to update expense');
  return res.json();
};

export const deleteExpense = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete expense');
};
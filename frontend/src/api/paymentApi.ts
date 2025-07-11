import { RentPayment } from '@/models/types';

const API_BASE = 'http://localhost:5000/api/rent-payments';

export const fetchPayments = async (): Promise<RentPayment[]> => {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch payments');
  return res.json();
};

export const fetchPaymentById = async (id: string): Promise<RentPayment> => {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch payment');
  return res.json();
};

export const createPayment = async (payment: Partial<RentPayment>): Promise<RentPayment> => {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payment),
  });
  if (!res.ok) throw new Error('Failed to create payment');
  return res.json();
};

export const updatePayment = async (id: string, payment: Partial<RentPayment>): Promise<RentPayment> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payment),
  });
  if (!res.ok) throw new Error('Failed to update payment');
  return res.json();
};

export const deletePayment = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete payment');
};
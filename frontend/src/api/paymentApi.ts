import { RentPayment } from '@/models/types';

const API_BASE = 'http://localhost:5000/api/rent-payments';

/**
 * Helper to get headers with Authorization
 */
function getHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export const fetchPayments = async (): Promise<RentPayment[]> => {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch payments');
  return res.json();
};

/**
 * Get Payment by ID
 */
export const fetchPaymentById = async (
  id: string,
  token: string
): Promise<RentPayment> => {
  const res = await fetch(`${API_BASE}/payments/${id}`, {
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to fetch payment');
  return res.json();
};

/**
 * Create Payment
 */
export const createPayment = async (
  payment: {
    pgId?: string; // Optional now
    tenantId: string;
    roomId: string;
    month: string; // YYYY-MM format
    dueDate: string; // ISO date
    rentAmount: number;
  }
): Promise<RentPayment> => {
  const resolvedPgId = payment.pgId || 'b6d09371-48c1-451b-a10c-6b8932443f7b'; // Default PG ID
  const res = await fetch(`${API_BASE}/payments`, {
    method: 'POST',
    // headers: (token),
    body: JSON.stringify({ ...payment, pgId: resolvedPgId }),
  });
  if (!res.ok) throw new Error('Failed to create payment');
  return res.json();
};

/**
 * Update Payment
 */
export const updatePayment = async (
  id: string,
  payment: Partial<RentPayment>,
  token: string
): Promise<RentPayment> => {
  const res = await fetch(`${API_BASE}/payments/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(payment),
  });
  if (!res.ok) throw new Error('Failed to update payment');
  return res.json();
};

/**
 * Delete Payment
 */
export const deletePayment = async (
  id: string,
  token: string
): Promise<void> => {
  const res = await fetch(`${API_BASE}/payments/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to delete payment');
};

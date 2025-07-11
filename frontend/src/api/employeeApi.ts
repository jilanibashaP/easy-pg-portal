import { Employee } from '@/models/types';

const API_BASE = 'http://localhost:5000/api/employees';

export const fetchEmployees = async (): Promise<Employee[]> => {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch employees');
  return res.json();
};

export const fetchEmployeeById = async (id: string): Promise<Employee> => {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch employee');
  return res.json();
};

export const createEmployee = async (employee: Partial<Employee>): Promise<Employee> => {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employee),
  });
  if (!res.ok) throw new Error('Failed to create employee');
  return res.json();
};

export const updateEmployee = async (id: string, employee: Partial<Employee>): Promise<Employee> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employee),
  });
  if (!res.ok) throw new Error('Failed to update employee');
  return res.json();
};

export const deleteEmployee = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete employee');
};
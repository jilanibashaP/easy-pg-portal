import { Tenant } from '@/models/types';

const API_BASE = 'http://localhost:5000/api/tenants';

export const fetchTenants = async (): Promise<Tenant[]> => {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch tenants');
  return res.json();
};

export const fetchTenantById = async (id: string): Promise<Tenant> => {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch tenant');
  return res.json();
};

export const createTenant = async (tenant: Partial<Tenant>): Promise<Tenant> => {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tenant),
  });
  if (!res.ok) throw new Error('Failed to create tenant');
  return res.json();
};

export const updateTenant = async (id: string, tenant: Partial<Tenant>): Promise<Tenant> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tenant),
  });
  if (!res.ok) throw new Error('Failed to update tenant');
  return res.json();
};

export const deleteTenant = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete tenant');
};
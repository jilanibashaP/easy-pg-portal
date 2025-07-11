import { Room } from '@/models/types';

const API_BASE = 'http://localhost:5000/api/rooms';


// Always use the static pgId for all API calls that require it
const STATIC_PG_ID = '1a2b3c4d-1234-5678-9101-abcdefabcdef';

export const fetchRooms = async (): Promise<Room[]> => {
  const res = await fetch(`${API_BASE}?pgId=${STATIC_PG_ID}`);
  if (!res.ok) throw new Error('Failed to fetch rooms');
  return res.json();
};

export const fetchRoomById = async (id: string): Promise<Room> => {
  const res = await fetch(`${API_BASE}/${id}?pgId=${STATIC_PG_ID}`);
  if (!res.ok) throw new Error('Failed to fetch room');
  return res.json();
};

export const createRoom = async (room: Partial<Room>): Promise<Room> => {
  // Always include pgId in the body
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...room, pgId: STATIC_PG_ID }),
  });
  if (!res.ok) throw new Error('Failed to create room');
  return res.json();
};

export const updateRoom = async (id: string, room: Partial<Room>): Promise<Room> => {
  // Always include pgId in the body
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...room, pgId: STATIC_PG_ID }),
  });
  if (!res.ok) throw new Error('Failed to update room');
  return res.json();
};

export const deleteRoom = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/${id}?pgId=${STATIC_PG_ID}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete room');
};
import { Request, Response } from 'express';
import { Room } from '../models/Room';
import { Tenant } from '../models/Tenant';

export const getAllRooms = async (req: Request, res: Response) => {
    try {
        console.log("Request body:", req.body);
        const { pgId } = req.body || req.query;
        if (!pgId || typeof pgId !== 'string') {
            return res.status(400).json({ error: 'pgId is required as a query parameter or in body' });
        }
        const where = pgId ? { pgId } : undefined;
        const rooms = await Room.findAll({ where });
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
};

export const createRoom = async (req: Request, res: Response) => {
    try {
        const { pgId } = req.body || req.query;
        if (!pgId || typeof pgId !== 'string') {
            return res.status(400).json({ error: 'pgId is required as a query parameter or in body' });
        }
        const room = await Room.create({ ...req.body, pgId });
        res.status(201).json(room);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create room' });
    }
};

export const getRoomById = async (req: Request, res: Response) => {
    try {

        const { pgId } = req.body || req.query;
        if (!pgId || typeof pgId !== 'string') {
            return res.status(400).json({ error: 'pgId is required as a query parameter or in body' });
        }
        const room = await Room.findOne({ where: { id: req.params.id, ...(pgId ? { pgId } : {}) } });
        if (!room) {
            res.status(404).json({ error: 'Room not found' });
            return;
        }
        res.json(room);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching room' });
    }
};

export const updateRoom = async (req: Request, res: Response) => {
    try {
        const { pgId } = req.body || req.query;
        if (!pgId || typeof pgId !== 'string') {
            return res.status(400).json({ error: 'pgId is required as a query parameter or in body' });
        }
        const room = await Room.findOne({ where: { id: req.params.id, ...(pgId ? { pgId } : {}) } });
        if (!room) {
            res.status(404).json({ error: 'Room not found' });
            return;
        }
        await room.update(req.body);
        res.json(room);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update room' });
    }
};

export const deleteRoom = async (req: Request, res: Response) => {
    try {
        const { pgId } = req.body || req.query;
        if (!pgId || typeof pgId !== 'string') {
            return res.status(400).json({ error: 'pgId is required as a query parameter or in body' });
        }
        const room = await Room.findOne({ where: { id: req.params.id, ...(pgId ? { pgId } : {}) } });
        if (!room) {
            res.status(404).json({ error: 'Room not found' });
            return;
        }
        await room.destroy();
        res.json({ message: 'Room deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete room' });
    }
};


export const getTenantsByRoomName = async (req: Request, res: Response) => {
    try {
        console.log("Request body:", req.body);
        const { roomName } = req.params;
        const { pgId } = req.body || req.query;
        if (!pgId || typeof pgId !== 'string') {
            return res.status(400).json({ error: 'pgId is required as a query parameter or in body' });
        }

        if (!pgId || typeof pgId !== 'string') {
            return res.status(400).json({ error: 'pgId is required as a query parameter' });
        }

        const decodedRoomName = decodeURIComponent(roomName).trim();
        console.log(`🔍 Fetching tenants for room "${decodedRoomName}" in PG ID: ${pgId}`);

        // Step 1: Find the room by name and pgId
        const room = await Room.findOne({
            where: { name: decodedRoomName, pgId },
        });

        if (!room) {
            return res.status(404).json({ error: 'Room not found for the given name and PG ID' });
        }

        // Step 2: Fetch tenants in that room
        const tenants = await Tenant.findAll({
            where: { roomId: room.id, pgId, isActive: true },
        });

        if (!tenants.length) {
            return res.status(404).json({ error: 'No tenants found for this room' });
        }

        res.json({ room: decodedRoomName, tenants });
    } catch (err: any) {
        console.error('❌ Error in getTenantsByRoomName:', err);
        res.status(500).json({ error: 'Failed to fetch tenants for the room', message: err.message });
    }
};

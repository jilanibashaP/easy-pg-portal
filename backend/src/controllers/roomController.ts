import { Request, Response } from 'express';
import { Room } from '../models/Room';
import { Tenant } from '../models/Tenant';

export const getAllRooms = async (req: Request, res: Response) => {
    try {
       console.log("Request body:", req.body);
        // if (!req.body?.pgId) {
        //     req.body.pgId = "1a2b3c4d-1234-5678-9101-abcdefabcdef"; // Fallback to query param if not in body
        // }
        // console.log("Fetching all rooms with pgId:", req.body.pgId);
        const pgId = "1a2b3c4d-1234-5678-9101-abcdefabcdef";
        const where = pgId ? { pgId } : undefined;
        const rooms = await Room.findAll({ where });
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
};

export const createRoom = async (req: Request, res: Response) => {
    try {
        // const { pgId } = req.body;
        const pgId = "1a2b3c4d-1234-5678-9101-abcdefabcdef";
        if (!pgId) {
            res.status(400).json({ error: 'pgId is required' });
            return;
        }
        
        const room = await Room.create({ ...req.body, pgId });
        res.status(201).json(room);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create room' });
    }
};

export const getRoomById = async (req: Request, res: Response) => {
    try {

        // const pgId = req.body.pgId;
        const pgId = "1a2b3c4d-1234-5678-9101-abcdefabcdef";
        console.log("Fetching room with id:", req.params.id, "and pgId:", pgId);
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

        // const { pgId } = req.body;
        const pgId = "1a2b3c4d-1234-5678-9101-abcdefabcdef";
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

        // const { pgId } = req.query;
        const pgId = "1a2b3c4d-1234-5678-9101-abcdefabcdef";
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


// Get tenants by room name
// export const getTenantsByRoomName = async (req: Request, res: Response) => {
//     try {
//         console.log("Request body:", req.body);
//         const pgId = "1a2b3c4d-1234-5678-9101-abcdefabcdef";
//         const { roomName } = req.params;
//         console.log("Fetching tenants for room:", roomName, "with pgId:", pgId);
//         // fetch the roomId based on room name and pgId
//         const roomDetails = await Room.findOne({
//             where: { name: roomName, pgId: pgId },
//         });

//         console.log("Tenants found:", roomDetails);
//         const roomId = roomDetails;
//         const tenants = await Tenant.findAll({
//             where: { roomId: roomId, pgId: pgId }
//         });
//         console.log("Tenants found:", tenants);
//         if (!tenants || tenants.length === 0) {
//             res.status(404).json({ error: 'No tenants found for this room' });
//             return;
//         }
//         res.json(tenants);
//     } catch (err) {
//         res.status(500).json({ error: 'Failed to fetch tenants for room' });
//     }
// };

export const getTenantsByRoomName = async (req: Request, res: Response) => {
  try {
    console.log("Request body:", req.body);
    const { roomName } = req.params;
    // const { pgId } = req.query;
    const pgId = "1a2b3c4d-1234-5678-9101-abcdefabcdef";

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

import { Request, Response } from 'express';
import { Tenant } from '../models/Tenant';
import { Room } from '../models/Room';

export const getAllTenants = async (req: Request, res: Response) => {
  try {
    // const { pgId } = req.query;
    const pgId = "1a2b3c4d-1234-5678-9101-abcdefabcdef";
    let where = {};
    if (pgId) {
      if (typeof pgId !== 'string') {
        res.status(400).json({ message: 'pgId must be a string if provided as a query parameter' });
        return;
      }
      where = { pgId };
    }

    const tenants = await Tenant.findAll({ where });
    res.status(200).json(tenants);
  } catch (error) {
    console.error('Error fetching tenants:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

export const getTenantById = async (req: Request, res: Response) => {
  // const { pgId } = req.query;
  const pgId = "1a2b3c4d-1234-5678-9101-abcdefabcdef";
  const tenant = await Tenant.findOne({
    where: { id: req.params.id, ...(pgId ? { pgId } : {}) },
  });
  if (tenant) {
    res.json(tenant);
    return;
  }
  res.status(404).json({ error: 'Not found' });
  return;
};

export const createTenant = async (req: Request, res: Response) => {
  try {
    const {
      pgId,
      name,
      contactNumber,
      email,
      roomId,
      bedNumber,
      joiningDate,
      rentDueDate,
      securityDeposit,
      monthlyRent,
      status,
      emergencyContactName,
      emergencyContactNumber,
      address,
      aadharNumber,
      isActive
    } = req.body;

    // Step 1: Validate required fields
    if (!pgId || !name || !contactNumber || !roomId || !bedNumber || !joiningDate || !rentDueDate) {
       res.status(400).json({ error: 'Missing required tenant fields' });
       return
    }

    // Step 2: Fetch room by roomId and pgId
    const roomDetails = await Room.findOne({ where: { id: roomId, pgId } });

    // Step 3: Validate room existence
    if (!roomDetails) {
       res.status(404).json({ error: 'Room not found in this PG' });
       return
    }

    // Step 4: Validate bed availability
    const occupiedBeds = roomDetails.occupiedBeds ?? 0;
    const totalBeds = roomDetails.totalBeds ?? 0;

    if (occupiedBeds >= totalBeds) {
       res.status(400).json({ error: 'No available beds in this room' });
        return;
    }

    // Step 5: Create the tenant
    const tenant = await Tenant.create({
      pgId,
      name,
      contactNumber,
      email,
      roomId,
      bedNumber,
      joiningDate,
      rentDueDate,
      securityDeposit,
      monthlyRent,
      status,
      emergencyContactName,
      emergencyContactNumber,
      address,
      aadharNumber,
      isActive
    });

    // console.log('New tenant created:', tenant?.id);

    // Step 6: Increment occupiedBeds in the room
    await roomDetails.update({ occupiedBeds: occupiedBeds + 1 });

    return res.status(201).json(tenant);
  } catch (error: any) {
    console.error('Error creating tenant:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};


export const updateTenant = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.body;

    // Step 1: Find the tenant by ID (and optionally pgId)
    const tenant = await Tenant.findOne({
      where: { id: req.params.id, ...(pgId ? { pgId } : {}) },
    });

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    // Step 2: Extract only updatable fields (protect sensitive ones like id, createdAt)
    const {
      name,
      contactNumber,
      email,
      roomId,
      bedNumber,
      joiningDate,
      rentDueDate,
      securityDeposit,
      monthlyRent,
      status,
      emergencyContactName,
      emergencyContactNumber,
      address,
      aadharNumber,
      isActive,
    } = req.body;

    await tenant.update({
      name,
      contactNumber,
      email,
      roomId,
      bedNumber,
      joiningDate,
      rentDueDate,
      securityDeposit,
      monthlyRent,
      status,
      emergencyContactName,
      emergencyContactNumber,
      address,
      aadharNumber,
      isActive,
    });

    return res.json({ message: 'Tenant updated successfully', tenant });
  } catch (error: any) {
    console.error('Error updating tenant:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};


export const deleteTenant = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.query;

    // Step 1: Find the tenant
    const tenant = await Tenant.findOne({
      where: { id: req.params.id, ...(pgId ? { pgId } : {}) },
    })as any;

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    // Step 2: Soft delete - mark tenant as inactive
    await tenant.update({ isActive: false });

    // Step 3: Find the associated room
    const room = await Room.findOne({
      where: { id: tenant.roomId, pgId: tenant.pgId },
    });

    // Step 4: Decrement occupiedBeds if possible
    if (room && typeof room.occupiedBeds === 'number' && room.occupiedBeds > 0) {
      await room.update({ occupiedBeds: room.occupiedBeds - 1 });
    }

    return res.json({ message: 'Tenant marked as inactive and room bed count updated' });
  } catch (error: any) {
    console.error('Error deleting tenant:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

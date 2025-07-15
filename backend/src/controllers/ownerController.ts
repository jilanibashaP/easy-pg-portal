import { Request, Response } from 'express';
import { Owner } from '../models/Owner';
import { Op } from 'sequelize';

// Create owner
export const createOwner = async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerData = req.body;
    
    // Check if email or phone already exists
    const existingOwner = await Owner.findOne({
      where: {
        [Op.or]: [
          { email: ownerData.email },
          { phoneNumber: ownerData.phoneNumber }
        ]
      }
    });

    if (existingOwner) {
      res.status(400).json({
        success: false,
        message: 'Owner with this email or phone number already exists'
      });
      return;
    }

    const owner = await Owner.create(ownerData);
    
    res.status(201).json({
      success: true,
      message: 'Owner created successfully',
      data: owner
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error creating owner',
      error: error.message
    });
  }
};

// Get all owners
export const getAllOwners = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      verificationStatus, 
      isActive,
      subscriptionPlan,
      city,
      state 
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const whereClause: any = {};

    // Search filter
    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phoneNumber: { [Op.iLike]: `%${search}%` } },
        { businessName: { [Op.iLike]: `%${search}%` } },
        { pgId: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Additional filters
    if (verificationStatus) whereClause.verificationStatus = verificationStatus;
    if (isActive !== undefined) whereClause.isActive = isActive === 'true';
    if (subscriptionPlan) whereClause.subscriptionPlan = subscriptionPlan;
    if (city) whereClause.city = { [Op.iLike]: `%${city}%` };
    if (state) whereClause.state = { [Op.iLike]: `%${state}%` };

    const { count, rows } = await Owner.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset: offset,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['aadharNumber', 'panNumber', 'accountNumber'] }
    });

    res.status(200).json({
      success: true,
      data: {
        owners: rows,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(count / Number(limit)),
          totalCount: count,
          hasNext: offset + Number(limit) < count,
          hasPrev: Number(page) > 1
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching owners',
      error: error.message
    });
  }
};

// Get owner by ID
export const getOwnerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const owner = await Owner.findByPk(id, {
      attributes: { exclude: ['aadharNumber', 'panNumber', 'accountNumber'] }
    });

    if (!owner) {
      res.status(404).json({
        success: false,
        message: 'Owner not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: owner
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching owner',
      error: error.message
    });
  }
};

// Get owner by PG ID
export const getOwnerByPgId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pgId } = req.params;
    
    const owner = await Owner.findOne({
      where: { pgId },
      attributes: { exclude: ['aadharNumber', 'panNumber', 'accountNumber'] }
    });

    if (!owner) {
      res.status(404).json({
        success: false,
        message: 'Owner not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: owner
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching owner',
      error: error.message
    });
  }
};

// Update owner
export const updateOwner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove pgId from update data (should not be updated)
    delete updateData.pgId;

    const owner = await Owner.findByPk(id);
    if (!owner) {
      res.status(404).json({
        success: false,
        message: 'Owner not found'
      });
      return;
    }

    // Check for duplicate email/phone if they're being updated
    if (updateData.email || updateData.phoneNumber) {
      const existingOwner = await Owner.findOne({
        where: {
          id: { [Op.ne]: id },
          [Op.or]: [
            ...(updateData.email ? [{ email: updateData.email }] : []),
            ...(updateData.phoneNumber ? [{ phoneNumber: updateData.phoneNumber }] : [])
          ]
        }
      });

      if (existingOwner) {
        res.status(400).json({
          success: false,
          message: 'Email or phone number already exists'
        });
        return;
      }
    }

    await owner.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Owner updated successfully',
      data: owner
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating owner',
      error: error.message
    });
  }
};

// Delete owner (soft delete)
export const deleteOwner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const owner = await Owner.findByPk(id);
    if (!owner) {
      res.status(404).json({
        success: false,
        message: 'Owner not found'
      });
      return;
    }

    await owner.update({ isActive: false });

    res.status(200).json({
      success: true,
      message: 'Owner deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting owner',
      error: error.message
    });
  }
};
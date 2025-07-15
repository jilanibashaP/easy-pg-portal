import { Router } from 'express';
import {
  createOwner,
  getAllOwners,
  getOwnerById,
  getOwnerByPgId,
  updateOwner,
  deleteOwner
} from '../controllers/ownerController';

const router = Router();

// CRUD Routes
router.post('/', createOwner);           // Create owner
router.get('/', getAllOwners);           // Get all owners with pagination/filtering
router.get('/:id', getOwnerById);        // Get owner by UUID
router.get('/pg/:pgId', getOwnerByPgId); // Get owner by PG ID
router.put('/:id', updateOwner);         // Update owner
router.delete('/:id', deleteOwner);      // Delete owner (soft delete)

export default router;
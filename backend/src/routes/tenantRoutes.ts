import express from 'express';
import * as controller from '../controllers/tenantController';
const router = express.Router();

router.get('/', controller.getAllTenants);
router.get('/:id', controller.getTenantById);
router.post('/', controller.createTenant);
router.put('/:id', controller.updateTenant);
router.delete('/:id', controller.deleteTenant);

export default router;

import express from 'express';
import * as controller from '../controllers/employeeController';
const router = express.Router();

router.get('/', controller.getAllEmployees);
router.get('/:id', controller.getEmployeeById);
router.post('/', controller.createEmployee);
router.put('/:id', controller.updateEmployee);
router.delete('/:id', controller.deleteEmployee);

export default router;

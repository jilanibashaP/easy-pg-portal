import express from 'express';
import * as controller from '../controllers/expenseController';
const router = express.Router();

router.get('/', controller.getAllExpenses);
router.get('/:id', controller.getExpenseById);
router.post('/', controller.createExpense);
router.put('/:id', controller.updateExpense);
router.delete('/:id', controller.deleteExpense);

export default router;

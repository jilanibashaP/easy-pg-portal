import { Router } from 'express';
import {
  getAllExpenses,
  getExpenseById,
  getExpensesByEmployee,
  getExpensesByDateRange,
  createExpense,
  updateExpense,
  deleteExpense
} from '../controllers/expenseController';

const router = Router();

// Get all expenses with optional filters
// GET /api/expenses?pgId=xxx&startDate=2024-01-01&endDate=2024-12-31&category=SALARY&paymentMethod=CASH&employeeId=xxx
router.get('/', getAllExpenses);

// Get expenses by date range
// GET /api/expenses/date-range?startDate=2024-01-01&endDate=2024-12-31&pgId=xxx&category=SALARY&paymentMethod=CASH
router.get('/date-range', getExpensesByDateRange);

// Get expenses by employee
// GET /api/expenses/employee/:employeeId?pgId=xxx&startDate=2024-01-01&endDate=2024-12-31&category=SALARY
router.get('/employee/:employeeId', getExpensesByEmployee);

// Get expense by ID
// GET /api/expenses/:id?pgId=xxx
router.get('/:id', getExpenseById);

// Create new expense
// POST /api/expenses
router.post('/', createExpense);

// Update expense
// PUT /api/expenses/:id
router.put('/:id', updateExpense);

// Delete expense
// DELETE /api/expenses/:id?pgId=xxx
router.delete('/:id', deleteExpense);

export default router;
import { Request, Response } from 'express';
import { Expense } from '../models/Expense';

export const getAllExpenses = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.query;
    const where = pgId ? { pgId } : undefined;
    const expenses = await Expense.findAll({ where });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.query;
    const expense = await Expense.findOne({ where: { id: req.params.id, ...(pgId ? { pgId } : {}) } });
    if (expense) {
      res.json(expense);
      return;
    }
    res.status(404).json({ error: 'Not found' });
    return;
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createExpense = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.body;
    if (!pgId) {
      res.status(400).json({ error: 'pgId is required' });
      return;
    }
    const expense = await Expense.create({ ...req.body, pgId });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.body;
    const expense = await Expense.findOne({ where: { id: req.params.id, ...(pgId ? { pgId } : {}) } });
    if (!expense) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    await expense.update(req.body);
    res.json(expense);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.query;
    const expense = await Expense.findOne({ where: { id: req.params.id, ...(pgId ? { pgId } : {}) } });
    if (!expense) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    await expense.destroy();
    res.json({ message: 'Deleted' });
    return;
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

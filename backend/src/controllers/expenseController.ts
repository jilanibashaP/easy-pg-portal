import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Expense } from '../models/Expense';

export const getAllExpenses = async (req: Request, res: Response) => {
  try {
    const { pgId, startDate, endDate, category, paymentMethod, employeeId } = req.query;
    const where: any = {};
    
    if (pgId) where.pgId = pgId;
    if (category) where.category = category;
    if (paymentMethod) where.paymentMethod = paymentMethod;
    if (employeeId) where.employeeId = employeeId;
    
    // Date range filter
    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate]
      };
    } else if (startDate) {
      where.date = {
        [Op.gte]: startDate
      };
    } else if (endDate) {
      where.date = {
        [Op.lte]: endDate
      };
    }
    
    const expenses = await Expense.findAll({ 
      where: Object.keys(where).length > 0 ? where : undefined,
      order: [['date', 'DESC']]
    });
    
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error });
  }
};

export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.query;
    const expense = await Expense.findOne({ 
      where: { 
        id: req.params.id, 
        ...(pgId ? { pgId } : {}) 
      } 
    });
    
    if (expense) {
      res.json(expense);
      return;
    }
    res.status(404).json({ error: 'Not found' });
    return;
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error });
  }
};

export const getExpensesByEmployee = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params;
    const { pgId, startDate, endDate, category } = req.query;
    
    const where: any = { employeeId };
    
    if (pgId) where.pgId = pgId;
    if (category) where.category = category;
    
    // Date range filter
    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate]
      };
    } else if (startDate) {
      where.date = {
        [Op.gte]: startDate
      };
    } else if (endDate) {
      where.date = {
        [Op.lte]: endDate
      };
    }
    
    const expenses = await Expense.findAll({ 
      where,
      order: [['date', 'DESC']]
    });
    
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error });
  }
};

export const getExpensesByDateRange = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const { pgId, category, paymentMethod } = req.query;
    
    if (!startDate || !endDate) {
      res.status(400).json({ error: 'Both startDate and endDate are required' });
      return;
    }
    
    const where: any = {
      date: {
        [Op.between]: [startDate, endDate]
      }
    };
    
    if (pgId) where.pgId = pgId;
    if (category) where.category = category;
    if (paymentMethod) where.paymentMethod = paymentMethod;
    
    const expenses = await Expense.findAll({ 
      where,
      order: [['date', 'DESC']]
    });
    
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error',  details: error });
  }
};

export const createExpense = async (req: Request, res: Response) => {
console.log("Creating expense with data:======>", req.body);
  try {
    const { pgId, date, amount, category, paymentMethod ,employeeId,description,vendorName} = req.body;
    
    if (!pgId) {
      res.status(400).json({ error: 'pgId is required' });
      return;
    }
    
    if (!date || !amount || !category || !paymentMethod) {
      res.status(400).json({ error: 'date, amount, category, and paymentMethod are required' });
      return;
    }
    
    const expense = await Expense.create({ pgId, date, amount, category,description, vendorName,paymentMethod,employeeId});
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.body;
    const expense = await Expense.findOne({ 
      where: { 
        id: req.params.id, 
        ...(pgId ? { pgId } : {}) 
      } 
    });
    
    if (!expense) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    
    await expense.update(req.body);
    res.json(expense);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error});
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.query;
    const expense = await Expense.findOne({ 
      where: { 
        id: req.params.id, 
        ...(pgId ? { pgId } : {}) 
      } 
    });
    
    if (!expense) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    
    await expense.destroy();
    res.json({ message: 'Deleted' });
    return;
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error });
  }
};
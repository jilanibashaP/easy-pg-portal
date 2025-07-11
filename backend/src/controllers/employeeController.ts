import { Request, Response } from 'express';
import { Employee } from '../models/Employee';

// Get all employees
export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.query;
    const where = pgId ? { pgId } : undefined;
    const employees = await Employee.findAll({ where });
    res.json(employees);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch employees', message: error.message });
  }
};

// Get employee by ID
export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.query;
    const employee = await Employee.findOne({
      where: { id: req.params.id, ...(pgId ? { pgId } : {}) },
    });

    if (!employee) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(employee);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch employee', message: error.message });
  }
};

// Create a new employee
export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.body;

    if (!pgId) {
      return res.status(400).json({ error: 'pgId is required' });
    }

    const employee = await Employee.create({ ...req.body, pgId });
    res.status(201).json(employee);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create employee', message: error.message });
  }
};

// Update an employee
export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.body;

    const employee = await Employee.findOne({
      where: { id: req.params.id, ...(pgId ? { pgId } : {}) },
    });

    if (!employee) {
      return res.status(404).json({ error: 'Not found' });
    }

    await employee.update(req.body);
    res.json(employee);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update employee', message: error.message });
  }
};

// Soft delete an employee (set isActive to false)
export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.query;

    const employee = await Employee.findOne({
      where: { id: req.params.id, ...(pgId ? { pgId } : {}) },
    });

    if (!employee) {
      return res.status(404).json({ error: 'Not found' });
    }

    // For soft delete, set isActive to false instead of destroying
    await employee.update({ isActive: false });

    res.json({ message: 'Employee marked as inactive' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete employee', message: error.message });
  }
};

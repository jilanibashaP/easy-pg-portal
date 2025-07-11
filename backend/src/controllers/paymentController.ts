import { Request, Response } from 'express';
import { Op, WhereOptions, fn, col } from 'sequelize';
import { RentPayment } from '../models/RentPayment';

// Utility type for query params
type QueryParams = {
  pgId?: string;
  tenantId?: string;
  roomId?: string;
  status?: string;
  month?: string;
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  year?: string;
};

export const getAllPayments = async (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
  try {
    const {
      pgId,
      tenantId,
      roomId,
      status,
      month,
      startDate,
      endDate,
      paymentMethod,
      page = '1',
      limit = '10',
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = req.query;

    const where: WhereOptions = {};

    if (pgId) where.pgId = pgId;
    if (tenantId) where.tenantId = tenantId;
    if (roomId) where.roomId = roomId;
    if (status) where.status = status;
    if (month) where.month = month;
    if (paymentMethod) where.paymentMethod = paymentMethod;

    if (startDate || endDate) {
      where.paidDate = {};
      if (startDate) where.paidDate[Op.gte] = new Date(startDate);
      if (endDate) where.paidDate[Op.lte] = new Date(endDate);
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows: payments } = await RentPayment.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [[sortBy, sortOrder]],
    });

    res.json({
      payments,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
        totalItems: count,
        itemsPerPage: Number(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const payment = await RentPayment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
};

export const createPayment = async (req: Request, res: Response) => {
  try {
    const payment = await RentPayment.create(req.body);
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment' });
  }
};

export const updatePayment = async (req: Request, res: Response) => {
  try {
    const payment = await RentPayment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    await payment.update(req.body);
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment' });
  }
};

export const deletePayment = async (req: Request, res: Response) => {
  try {
    const payment = await RentPayment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    await payment.destroy();
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete payment' });
  }
};

export const getPaymentsByTenant = async (req: Request<{ tenantId: string }, {}, {}, QueryParams>, res: Response) => {
  try {
    const { tenantId } = req.params;
    const { status, startDate, endDate, sortBy = 'dueDate', sortOrder = 'DESC' } = req.query;

    const where: WhereOptions = { tenantId };
    if (status) where.status = status;
    if (startDate || endDate) {
      where.paidDate = {};
      if (startDate) where.paidDate[Op.gte] = new Date(startDate);
      if (endDate) where.paidDate[Op.lte] = new Date(endDate);
    }

    const payments = await RentPayment.findAll({
      where,
      order: [[sortBy, sortOrder]],
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tenant payments' });
  }
};

export const getPaymentsByRoom = async (req: Request<{ roomId: string }, {}, {}, QueryParams>, res: Response) => {
  try {
    const { roomId } = req.params;
    const { status, startDate, endDate, sortBy = 'dueDate', sortOrder = 'DESC' } = req.query;

    const where: WhereOptions = { roomId };
    if (status) where.status = status;
    if (startDate || endDate) {
      where.paidDate = {};
      if (startDate) where.paidDate[Op.gte] = new Date(startDate);
      if (endDate) where.paidDate[Op.lte] = new Date(endDate);
    }

    const payments = await RentPayment.findAll({
      where,
      order: [[sortBy, sortOrder]],
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch room payments' });
  }
};

export const getPaymentsByPG = async (req: Request<{ pgId: string }, {}, {}, QueryParams>, res: Response) => {
  try {
    const { pgId } = req.params;
    const { status, startDate, endDate, sortBy = 'dueDate', sortOrder = 'DESC' } = req.query;

    const where: WhereOptions = { pgId };
    if (status) where.status = status;
    if (startDate || endDate) {
      where.paidDate = {};
      if (startDate) where.paidDate[Op.gte] = new Date(startDate);
      if (endDate) where.paidDate[Op.lte] = new Date(endDate);
    }

    const payments = await RentPayment.findAll({
      where,
      order: [[sortBy, sortOrder]],
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch PG payments' });
  }
};

export const getOverduePayments = async (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
  try {
    const { pgId } = req.query;
    const where: WhereOptions = {
      status: 'OVERDUE',
      dueDate: { [Op.lt]: new Date() },
    };

    if (pgId) where.pgId = pgId;

    const payments = await RentPayment.findAll({
      where,
      order: [['dueDate', 'ASC']],
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch overdue payments' });
  }
};

export const getPendingPayments = async (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
  try {
    const { pgId } = req.query;
    const where: WhereOptions = { status: 'PENDING' };
    if (pgId) where.pgId = pgId;

    const payments = await RentPayment.findAll({
      where,
      order: [['dueDate', 'ASC']],
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending payments' });
  }
};

export const markPaymentAsPaid = async (req: Request<{ id: string }, {}, {
  paidAmount?: any;
  paymentMethod?: any;
  paidDate?: any;
}>, res: Response) => {
  try {
    const { id } = req.params;
    const { paidAmount, paymentMethod, paidDate = new Date() } = req.body;

    const payment = await RentPayment.findByPk(id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    await payment.update({
      status: 'PAID',
      paidAmount: paidAmount ?? payment.paidAmount,
      paymentMethod,
      paidDate,
    });

    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark payment as paid' });
  }
};

export const getPaymentSummary = async (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
  try {
    const { pgId, startDate, endDate, month } = req.query;
    const where: WhereOptions = {};

    if (pgId) where.pgId = pgId;
    if (month) where.month = month;
    if (startDate || endDate) {
      where.paidDate = {};
      if (startDate) where.paidDate[Op.gte] = new Date(startDate);
      if (endDate) where.paidDate[Op.lte] = new Date(endDate);
    }

    const [totalPayments, paidPayments, pendingPayments, overduePayments] = await Promise.all([
      RentPayment.count({ where }),
      RentPayment.count({ where: { ...where, status: 'PAID' } }),
      RentPayment.count({ where: { ...where, status: 'PENDING' } }),
      RentPayment.count({ where: { ...where, status: 'OVERDUE' } }),
    ]);

    const [totalAmount, paidAmount, pendingAmount, overdueAmount] = await Promise.all([
      RentPayment.sum('rentAmount', { where }),
      RentPayment.sum('paidAmount', { where: { ...where, status: 'PAID' } }),
      RentPayment.sum('rentAmount', { where: { ...where, status: 'PENDING' } }),
      RentPayment.sum('rentAmount', { where: { ...where, status: 'OVERDUE' } }),
    ]);

    const totalLateFees = await RentPayment.sum('lateFee', { where });

    res.json({
      counts: {
        total: totalPayments,
        paid: paidPayments,
        pending: pendingPayments,
        overdue: overduePayments,
      },
      amounts: {
        totalRent: totalAmount ?? 0,
        paidAmount: paidAmount ?? 0,
        pendingAmount: pendingAmount ?? 0,
        overdueAmount: overdueAmount ?? 0,
        totalLateFees: totalLateFees ?? 0,
      },
      collectionRate: totalAmount ? ((paidAmount ?? 0) / totalAmount * 100).toFixed(2) : '0',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment summary' });
  }
};

export const getMonthlyPaymentReport = async (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
  try {
    const { pgId, year } = req.query;
    const where: WhereOptions = {};

    if (pgId) where.pgId = pgId;
    if (year) where.month = { [Op.like]: `${year}-%` };

    const payments = await RentPayment.findAll({
      where,
      attributes: [
        'month',
        [fn('COUNT', col('id')), 'totalPayments'],
        [fn('SUM', col('rentAmount')), 'totalRent'],
        [fn('SUM', col('paidAmount')), 'totalPaid'],
        [fn('SUM', col('lateFee')), 'totalLateFees'],
      ],
      group: ['month'],
      order: [['month', 'ASC']],
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch monthly payment report' });
  }
};

export const bulkUpdatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { paymentIds, status, paidDate, paymentMethod } = req.body;

    if (!paymentIds || !Array.isArray(paymentIds) || paymentIds.length === 0) {
      return res.status(400).json({ error: 'Payment IDs are required' });
    }

    const updateData: Record<string, any> = { status };
    if (paidDate) updateData.paidDate = paidDate;
    if (paymentMethod) updateData.paymentMethod = paymentMethod;

    await RentPayment.update(updateData, {
      where: { id: { [Op.in]: paymentIds } },
    });

    res.json({ message: 'Payments updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payments' });
  }
};

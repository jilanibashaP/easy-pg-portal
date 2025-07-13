import { Request, Response } from 'express';
import { RentPayment } from '../models/RentPayment';
import { Op, fn, col, Model, DataTypes } from 'sequelize';

// =============================================
// 1. PAYMENT CREATION & MANAGEMENT METHODS
// =============================================

// Create a new rent payment record
export const createPayment = async (req: Request, res: Response) => {
  try {
    console.log('Creating payment with data:', req.body);
    const { pgId, tenantId, roomId, month, dueDate, rentAmount } = req.body;

    const payment = await RentPayment.create({
      pgId,
      tenantId,
      roomId,
      month,
      dueDate,
      rentAmount,
      paidAmount: 0,
      lateFee: 0,
      status: 'PENDING'
    });

    res.status(201).json({
      success: true,
      message: 'Payment record created successfully',
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating payment record',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update payment status
export const updatePayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const presentDate = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
    const { paidAmount, paymentMethod = "CASH", status = "PAID", paidDate = presentDate } = req.body;
    const payment = await RentPayment.findByPk(id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // Create update object by merging existing payment data with updates
    const updateData = {
      ...payment.toJSON(), // Get all existing attributes
      paidAmount,
      paymentMethod,
      status,
      paidDate // Override with provided updates
    };

    // Update the payment record
    await payment.update(updateData);

    // Reload to get fresh data
    await payment.reload();

    res.json({
      success: true,
      message: 'Payment updated successfully',
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating payment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete payment record
export const deletePayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const payment = await RentPayment.findByPk(id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    await payment.destroy();

    res.json({
      success: true,
      message: 'Payment record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting payment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// =============================================
// 2. PAYMENT VIEWING & LISTING METHODS
// =============================================

// Get all payments for a specific PG
export const getPgPayments = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.params;
    const { page = 1, limit = 10, sortBy = 'dueDate', sortOrder = 'DESC' } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    const payments = await RentPayment.findAndCountAll({
      where: { pgId },
      order: [[sortBy as string, sortOrder as string]],
      limit: Number(limit),
      offset
    });

    res.json({
      success: true,
      data: payments.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: payments.count,
        pages: Math.ceil(payments.count / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching PG payments',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get payments for a specific tenant
export const getTenantPayments = async (req: Request, res: Response) => {
  try {
    const { tenantId, pgId } = req.params;

    const payments = await RentPayment.findAll({
      where: { tenantId, pgId },
      order: [['dueDate', 'DESC']]
    });

    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tenant payments',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get payments for a specific room
export const getRoomPayments = async (req: Request, res: Response) => {
  try {
    const { roomId, pgId } = req.params;

    const payments = await RentPayment.findAll({
      where: { roomId, pgId },
      order: [['dueDate', 'DESC']]
    });

    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching room payments',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get specific payment by ID
export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const payment = await RentPayment.findByPk(id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// =============================================
// 3. PAYMENT STATUS MANAGEMENT METHODS
// =============================================

// Get pending payments
export const getPendingPayments = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.params;

    const payments = await RentPayment.findAll({
      where: {
        pgId,
        status: 'PENDING'
      },
      order: [['dueDate', 'ASC']]
    });

    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending payments',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get overdue payments
export const getOverduePayments = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.params;

    const payments = await RentPayment.findAll({
      where: {
        pgId,
        status: 'OVERDUE'
      },
      order: [['dueDate', 'ASC']]
    });

    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching overdue payments',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get paid payments
export const getPaidPayments = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.params;

    const payments = await RentPayment.findAll({
      where: {
        pgId,
        status: 'PAID'
      },
      order: [['paidDate', 'DESC']]
    });

    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching paid payments',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Mark payment as paid
export const markPaymentAsPaid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { paidAmount, paymentMethod } = req.body;

    const payment = await RentPayment.findByPk(id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    await payment.update({
      status: 'PAID',
      paidAmount,
      paymentMethod,
      paidDate: new Date()
    });

    res.json({
      success: true,
      message: 'Payment marked as paid successfully',
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking payment as paid',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Mark payment as overdue
export const markPaymentAsOverdue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { lateFee = 0 } = req.body;

    const payment = await RentPayment.findByPk(id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    await payment.update({
      status: 'OVERDUE',
      lateFee
    });

    res.json({
      success: true,
      message: 'Payment marked as overdue successfully',
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking payment as overdue',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// =============================================
// 6. FILTERING & SEARCH METHODS
// =============================================

// Filter payments by date range
export const getPaymentsByDateRange = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.params;
    const { startDate, endDate } = req.query;

    const payments = await RentPayment.findAll({
      where: {
        pgId,
        dueDate: {
          [Op.between]: [startDate as string, endDate as string]
        }
      },
      order: [['dueDate', 'DESC']]
    });

    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payments by date range',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Filter payments by month
export const getPaymentsByMonth = async (req: Request, res: Response) => {
  try {
    const { pgId, month } = req.params;

    const payments = await RentPayment.findAll({
      where: {
        pgId,
        month
      },
      order: [['dueDate', 'DESC']]
    });

    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payments by month',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Search payments
export const searchPayments = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.params;
    const { q } = req.query;

    // This would require joins with tenant and room tables
    // For now, implementing basic search on payment fields
    const payments = await RentPayment.findAll({
      where: {
        pgId,
        [Op.or]: [
          { tenantId: { [Op.iLike]: `%${q}%` } },
          { roomId: { [Op.iLike]: `%${q}%` } }
        ]
      },
      order: [['dueDate', 'DESC']]
    });

    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching payments',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Filter by payment method
export const getPaymentsByMethod = async (req: Request, res: Response) => {
  try {
    const { pgId, method } = req.params;

    const payments = await RentPayment.findAll({
      where: {
        pgId,
        paymentMethod: method
      },
      order: [['paidDate', 'DESC']]
    });

    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payments by method',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// =============================================
// 7. ANALYTICS & REPORTING METHODS
// =============================================

// Get payment summary
export const getPaymentSummary = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.params;

    const summary = await RentPayment.findAll({
      where: { pgId },
      attributes: [
        'status',
        [fn('SUM', col('paidAmount')), 'totalAmount'],
        [fn('COUNT', '*'), 'count']
      ],
      group: ['status']
    });

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment summary',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Monthly revenue report
export const getMonthlyRevenue = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.params;

    const revenue = await RentPayment.findAll({
      where: {
        pgId,
        status: 'PAID'
      },
      attributes: [
        'month',
        [fn('SUM', col('paidAmount')), 'totalRevenue'],
        [fn('COUNT', '*'), 'paymentCount']
      ],
      group: ['month'],
      order: [['month', 'DESC']]
    });

    res.json({
      success: true,
      data: revenue
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching monthly revenue',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Tenant payment performance
export const getTenantPaymentPerformance = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.params;

    const performance = await RentPayment.findAll({
      where: { pgId },
      attributes: [
        'tenantId',
        'status',
        [fn('COUNT', '*'), 'count']
      ],
      group: ['tenantId', 'status'],
      order: [['tenantId', 'ASC']]
    });

    res.json({
      success: true,
      data: performance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tenant payment performance',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Collection efficiency
export const getCollectionEfficiency = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.params;

    const totalPayments = await RentPayment.count({ where: { pgId } });
    const paidPayments = await RentPayment.count({
      where: { pgId, status: 'PAID' }
    });
    const overduePayments = await RentPayment.count({
      where: { pgId, status: 'OVERDUE' }
    });

    const efficiency = {
      totalPayments,
      paidPayments,
      overduePayments,
      collectionRate: totalPayments > 0 ? (paidPayments / totalPayments) * 100 : 0,
      overdueRate: totalPayments > 0 ? (overduePayments / totalPayments) * 100 : 0
    };

    res.json({
      success: true,
      data: efficiency
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating collection efficiency',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Outstanding dues
export const getOutstandingDues = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.params;

    const outstandingDues = await RentPayment.findAll({
      where: {
        pgId,
        status: { [Op.in]: ['PENDING', 'OVERDUE'] }
      },
      attributes: [
        [fn('SUM', col('rentAmount')), 'totalDues'],
        [fn('SUM', col('lateFee')), 'totalLateFees'],
        [fn('COUNT', '*'), 'paymentCount']
      ]
    });

    res.json({
      success: true,
      data: outstandingDues[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching outstanding dues',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Payment method analytics
export const getPaymentMethodAnalytics = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.params;

    const analytics = await RentPayment.findAll({
      where: {
        pgId,
        status: 'PAID'
      },
      attributes: [
        'paymentMethod',
        [fn('COUNT', '*'), 'count'],
        [fn('SUM', col('paidAmount')), 'totalAmount']
      ],
      group: ['paymentMethod']
    });

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment method analytics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// =============================================
// 8. NOTIFICATION & REMINDER METHODS
// =============================================

// Get payment reminders
export const getPaymentReminders = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.params;
    const today = new Date();
    const reminderDate = new Date(today);
    reminderDate.setDate(today.getDate() + 3); // 3 days before due date

    const reminders = await RentPayment.findAll({
      where: {
        pgId,
        status: 'PENDING',
        dueDate: {
          [Op.between]: [today, reminderDate]
        }
      },
      order: [['dueDate', 'ASC']]
    });

    res.json({
      success: true,
      data: reminders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment reminders',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Mark reminder as sent
export const markReminderSent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const payment = await RentPayment.findByPk(id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // You might want to add a reminderSent field to the model
    // For now, we'll just acknowledge the action
    res.json({
      success: true,
      message: 'Reminder marked as sent'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking reminder as sent',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get overdue notices
export const getOverdueNotices = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.params;

    const notices = await RentPayment.findAll({
      where: {
        pgId,
        status: 'OVERDUE'
      },
      order: [['dueDate', 'ASC']]
    });

    res.json({
      success: true,
      data: notices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching overdue notices',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// =============================================
// 14. DASHBOARD METHODS
// =============================================

// Today's collections
export const getTodayCollections = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.params;
    const today = new Date().toISOString().split('T')[0];

    const collections = await RentPayment.findAll({
      where: {
        pgId,
        status: 'PAID',
        paidDate: today
      },
      attributes: [
        [fn('SUM', col('paidAmount')), 'totalAmount'],
        [fn('COUNT', '*'), 'paymentCount']
      ]
    });

    res.json({
      success: true,
      data: collections[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching today\'s collections',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// This week's collections
export const getWeekCollections = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.params;
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    const collections = await RentPayment.findAll({
      where: {
        pgId,
        status: 'PAID',
        paidDate: {
          [Op.gte]: weekStart
        }
      },
      attributes: [
        [fn('SUM', col('paidAmount')), 'totalAmount'],
        [fn('COUNT', '*'), 'paymentCount']
      ]
    });

    res.json({
      success: true,
      data: collections[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching week\'s collections',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Monthly target vs actual
export const getMonthlyTarget = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.params;
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

    const actual = await RentPayment.findAll({
      where: {
        pgId,
        month: currentMonth,
        status: 'PAID'
      },
      attributes: [
        [fn('SUM', col('paidAmount')), 'actualAmount']
      ]
    });

    const target = await RentPayment.findAll({
      where: {
        pgId,
        month: currentMonth
      },
      attributes: [
        [fn('SUM', col('rentAmount')), 'targetAmount']
      ]
    });

    res.json({
      success: true,
      data: {
        target: target[0],
        actual: actual[0]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching monthly target',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Recent activities
export const getRecentActivities = async (req: Request, res: Response) => {
  try {
    const { pgId } = req.params;

    const activities = await RentPayment.findAll({
      where: { pgId },
      order: [['updatedAt', 'DESC']],
      limit: 10
    });

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recent activities',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
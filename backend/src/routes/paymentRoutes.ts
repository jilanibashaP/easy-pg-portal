import express from 'express';
import {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  getPaymentsByTenant,
  getPaymentsByRoom,
  getPaymentsByPG,
  getOverduePayments,
  getPendingPayments,
  markPaymentAsPaid,
  getPaymentSummary,
  getMonthlyPaymentReport,
  bulkUpdatePaymentStatus
} from '../controllers/paymentController';

const router = express.Router();

// Basic CRUD operations
router.get('/', getAllPayments);                    // GET /api/payments
router.get('/:id', getPaymentById);                 // GET /api/payments/:id
router.post('/', createPayment);                    // POST /api/payments
router.put('/:id', updatePayment);                  // PUT /api/payments/:id
router.delete('/:id', deletePayment);               // DELETE /api/payments/:id

// Filtered queries
router.get('/tenant/:tenantId', getPaymentsByTenant);  // GET /api/payments/tenant/:tenantId
router.get('/room/:roomId', getPaymentsByRoom);        // GET /api/payments/room/:roomId
router.get('/pg/:pgId', getPaymentsByPG);              // GET /api/payments/pg/:pgId

// Status-based queries
router.get('/status/overdue', getOverduePayments);     // GET /api/payments/status/overdue
router.get('/status/pending', getPendingPayments);     // GET /api/payments/status/pending

// Payment actions
router.patch('/:id/mark-paid', markPaymentAsPaid);     // PATCH /api/payments/:id/mark-paid
router.patch('/bulk-update', bulkUpdatePaymentStatus); // PATCH /api/payments/bulk-update

// Analytics and reporting
router.get('/analytics/summary', getPaymentSummary);       // GET /api/payments/analytics/summary
router.get('/analytics/monthly', getMonthlyPaymentReport); // GET /api/payments/analytics/monthly

export default router;
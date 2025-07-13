import { Router } from 'express';
import {
  // Payment creation & management
  createPayment,
  updatePayment,
  deletePayment,
  
  // Payment viewing & listing
  getPgPayments,
  getTenantPayments,
  getRoomPayments,
  getPaymentById,
  
  // Payment status management
  getPendingPayments,
  getOverduePayments,
  getPaidPayments,
  markPaymentAsPaid,
  markPaymentAsOverdue,
  
  // Filtering & search
  getPaymentsByDateRange,
  getPaymentsByMonth,
  searchPayments,
  getPaymentsByMethod,
  
  // Analytics & reporting
  getPaymentSummary,
  getMonthlyRevenue,
  getTenantPaymentPerformance,
  getCollectionEfficiency,
  getOutstandingDues,
  getPaymentMethodAnalytics,
  
  // Notification & reminder
  getPaymentReminders,
  markReminderSent,
  getOverdueNotices,
  
  // Dashboard
  getTodayCollections,
  getWeekCollections,
  getMonthlyTarget,
  getRecentActivities
} from '../controllers/paymentController';

const router = Router();

// =============================================
// 1. PAYMENT CREATION & MANAGEMENT ROUTES
// =============================================

// Create a new rent payment record (usually for new billing cycle)
router.post('/payments', createPayment);

// Update payment status (mark as paid, update paid amount, etc.)
router.put('/payments/:id', updatePayment);

// Delete a payment record
router.delete('/payments/:id', deletePayment);

// =============================================
// 2. PAYMENT VIEWING & LISTING ROUTES
// =============================================

// Get all payments for a specific PG
router.get('/pg/:pgId/payments', getPgPayments);

// Get payments for a specific tenant
router.get('/tenant/:tenantId/payments', getTenantPayments);

// Get payments for a specific room
router.get('/room/:roomId/payments', getRoomPayments);

// Get a specific payment by ID
router.get('/payments/:id', getPaymentById);

// =============================================
// 3. PAYMENT STATUS MANAGEMENT ROUTES
// =============================================

// Get all pending payments
router.get('/pg/:pgId/payments/pending', getPendingPayments);

// Get all overdue payments
router.get('/pg/:pgId/payments/overdue', getOverduePayments);

// Get all paid payments
router.get('/pg/:pgId/payments/paid', getPaidPayments);

// Mark payment as paid
router.patch('/payments/:id/mark-paid', markPaymentAsPaid);

// Mark payment as overdue
router.patch('/payments/:id/mark-overdue', markPaymentAsOverdue);

// =============================================
// 6. FILTERING & SEARCH ROUTES
// =============================================

// Filter payments by date range
router.get('/pg/:pgId/payments/date-range', getPaymentsByDateRange);

// Filter payments by month/year
router.get('/pg/:pgId/payments/month/:month', getPaymentsByMonth);

// Search payments by tenant name or room number
router.get('/pg/:pgId/payments/search', searchPayments);

// Filter by payment method
router.get('/pg/:pgId/payments/method/:method', getPaymentsByMethod);

// =============================================
// 7. ANALYTICS & REPORTING ROUTES
// =============================================

// Get payment summary for dashboard
router.get('/pg/:pgId/payments/summary', getPaymentSummary);

// Monthly revenue report
router.get('/pg/:pgId/revenue/monthly', getMonthlyRevenue);

// Tenant payment performance
router.get('/pg/:pgId/tenant-payment-performance', getTenantPaymentPerformance);

// Collection efficiency report
router.get('/pg/:pgId/collection-efficiency', getCollectionEfficiency);

// Outstanding dues report
router.get('/pg/:pgId/outstanding-dues', getOutstandingDues);

// Payment method analytics
router.get('/pg/:pgId/payment-methods/analytics', getPaymentMethodAnalytics);

// =============================================
// 8. NOTIFICATION & REMINDER ROUTES
// =============================================

// Get tenants to send payment reminders
router.get('/pg/:pgId/payment-reminders', getPaymentReminders);

// Mark reminder as sent
router.patch('/payments/:id/reminder-sent', markReminderSent);

// Get overdue notice recipients
router.get('/pg/:pgId/overdue-notices', getOverdueNotices);

// =============================================
// 14. DASHBOARD ROUTES
// =============================================

// Today's collections
router.get('/pg/:pgId/today-collections', getTodayCollections);

// This week's collections
router.get('/pg/:pgId/week-collections', getWeekCollections);

// Monthly collection target vs actual
router.get('/pg/:pgId/monthly-target', getMonthlyTarget);

// Recent payment activities
router.get('/pg/:pgId/recent-activities', getRecentActivities);

export default router;
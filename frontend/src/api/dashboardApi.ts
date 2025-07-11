import { fetchTenants } from './tenantApi';
import { fetchRooms } from './roomApi';
import { fetchEmployees } from './employeeApi';
import { fetchPayments } from './paymentApi';
import { fetchExpenses } from './expenseApi';
import { DashboardSummary, IncomeExpenseSummary, ExpenseCategory, PaymentStatus, TenantStatus } from '@/models/types';

// Dashboard summary
export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const [rooms, tenants, employees, rentPayments] = await Promise.all([
    fetchRooms(),
    fetchTenants(),
    fetchEmployees(),
    fetchPayments(),
  ]);

  console.log('Rooms:', rooms);
  console.log('Tenants:', tenants);

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.occupiedBeds > 0).length;
  const totalBeds = rooms.reduce((sum, r) => sum + r.totalBeds, 0);
  const occupiedBeds = rooms.reduce((sum, r) => sum + r.occupiedBeds, 0);
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const totalTenants = tenants.length;
  const activeTenants = tenants.filter(t => t.status === TenantStatus.ACTIVE).length;
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.isActive).length;

  // Financials for current month
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7); // 'YYYY-MM'
  const currentMonthPayments = rentPayments.filter(
    p => p.month === currentMonth
  );
  const currentMonthIncome = currentMonthPayments.reduce((sum, p) => sum + (p.paidAmount || 0), 0);

  // Expenses for current month
  const expenses = await fetchExpenses();
  const currentMonthExpenses = expenses
    .filter(e => e.date.slice(0, 7) === currentMonth)
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  const currentMonthProfit = currentMonthIncome - currentMonthExpenses;

  // Pending and overdue payments
  const pendingPayments = rentPayments.filter(p => p.status === PaymentStatus.PENDING).length;
  const overduePayments = rentPayments.filter(p => p.status === PaymentStatus.OVERDUE).length;

  // Upcoming rent dues
  const today = now.toISOString().slice(0, 10);
  const thisWeek = new Date(now);
  thisWeek.setDate(now.getDate() + 7);
  const thisMonth = now.toISOString().slice(0, 7);

  const upcomingRentDues = {
    today: rentPayments.filter(p => p.dueDate === today && p.status !== PaymentStatus.PAID).length,
    thisWeek: rentPayments.filter(p => {
      const due = new Date(p.dueDate);
      return due > now && due <= thisWeek && p.status !== PaymentStatus.PAID;
    }).length,
    thisMonth: rentPayments.filter(p => p.dueDate.slice(0, 7) === thisMonth && p.status !== PaymentStatus.PAID).length,
  };

  return {
    totalRooms,
    occupiedRooms,
    totalBeds,
    occupiedBeds,
    occupancyRate,
    totalTenants,
    activeTenants,
    totalEmployees,
    activeEmployees,
    currentMonthIncome,
    currentMonthExpenses,
    currentMonthProfit,
    pendingPayments,
    overduePayments,
    upcomingRentDues,
  };
};

// Income/Expense summary
export const getIncomeExpenseSummary = async (): Promise<IncomeExpenseSummary> => {
  const [rentPayments, expenses] = await Promise.all([
    fetchPayments(),
    fetchExpenses(),
  ]);

  // Income breakdown
  let rentIncome = 0, lateFees = 0, deposits = 0, other = 0;
  rentPayments.forEach(p => {
    rentIncome += p.paidAmount || 0;
    lateFees += p.lateFee || 0;
    // Add logic for deposits/other if you have such fields
  });

  // Expense breakdown
  const expenseBreakdown: { [key in ExpenseCategory]: number } = {} as any;
  Object.values(ExpenseCategory).forEach(cat => expenseBreakdown[cat] = 0);
  expenses.forEach(e => {
    expenseBreakdown[e.category] += e.amount || 0;
  });

  const totalIncome = rentIncome + lateFees + deposits + other;
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const netProfit = totalIncome - totalExpenses;

  // Monthly data
  const months = new Set<string>();
  rentPayments.forEach(p => months.add(p.month));
  expenses.forEach(e => months.add(e.date.slice(0, 7)));
  const monthlyData = Array.from(months).sort().map(month => {
    const income = rentPayments.filter(p => p.month === month).reduce((sum, p) => sum + (p.paidAmount || 0) + (p.lateFee || 0), 0);
    const expensesSum = expenses.filter(e => e.date.slice(0, 7) === month).reduce((sum, e) => sum + (e.amount || 0), 0);
    return {
      month,
      income,
      expenses: expensesSum,
      netProfit: income - expensesSum,
    };
  });

  return {
    totalIncome,
    totalExpenses,
    netProfit,
    incomeBreakdown: { rentIncome, lateFees, deposits, other },
    expenseBreakdown,
    monthlyData,
  };
};
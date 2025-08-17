import { fetchTenants } from './tenantApi';
import { fetchRooms } from './roomApi';
import { fetchEmployees } from './employeeApi';
import { DashboardSummary, TenantStatus } from '@/models/types';

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const pgId = "b6d09371-48c1-451b-a10c-6b8932443f7b";
  const [rooms, tenants, employees] = await Promise.all([
    fetchRooms(),
    fetchTenants(),
    fetchEmployees(),
  ]);

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.occupiedBeds > 0).length;
  const totalBeds = rooms.reduce((sum, r) => sum + r.totalBeds, 0);
  const occupiedBeds = rooms.reduce((sum, r) => sum + r.occupiedBeds, 0);
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const totalTenants = tenants.length;
  const activeTenants = tenants.filter(t => t.status === TenantStatus.ACTIVE).length;
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.isActive).length;

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
    currentMonthIncome: 0, // TODO: Replace with actual calculation
    currentMonthExpenses: 0, // TODO: Replace with actual calculation
    currentMonthProfit: 0, // TODO: Replace with actual calculation
    pendingPayments: 0, // TODO: Replace with actual calculation
    overduePayments: 0, // TODO: Replace with actual calculation
    upcomingRentDues: {
      today: 0, // TODO: Replace with actual calculation
      thisWeek: 0, // TODO: Replace with actual calculation
      thisMonth: 0, // TODO: Replace with actual calculation
    },
    // Add other missing properties with default values as needed
  };
};
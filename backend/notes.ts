// Essential Enums
export enum RoomType {
  SINGLE = 'SINGLE',
  DOUBLE = 'DOUBLE',
  TRIPLE = 'TRIPLE',
  QUAD = 'QUAD'
}

export enum PaymentStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  OVERDUE = 'OVERDUE'
}

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  UPI = 'UPI'
}

export enum TenantStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum ExpenseCategory {
  SALARY = 'SALARY',
  UTILITY = 'UTILITY',
  MAINTENANCE = 'MAINTENANCE',
  SUPPLIES = 'SUPPLIES',
  FOOD = 'FOOD',
  RENT = 'RENT', // If you pay rent for the building
  INSURANCE = 'INSURANCE',
  REPAIRS = 'REPAIRS',
  CLEANING = 'CLEANING',
  INTERNET = 'INTERNET',
  OTHER = 'OTHER'
}

// Core Schemas
export interface Room {
  id: string;
  name: string;
  type: RoomType;
  floor: number;
  totalBeds: number;
  occupiedBeds: number;
  monthlyRent: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  contactNumber: string;
  email?: string;
  roomId: string;
  bedNumber: number;
  joiningDate: string;
  leavingDate?: string;
  rentDueDate: number; // Day of month when rent is due
  securityDeposit: number;
  monthlyRent: number;
  status: TenantStatus;
  emergencyContact: {
    name: string;
    contactNumber: string;
  };
  address: string;
  aadharNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  name: string;
  contactNumber: string;
  email?: string;
  role: string; // e.g., 'CLEANING_STAFF', 'SECURITY', 'COOK', 'MANAGER'
  salary: number;
  joiningDate: string;
  leavingDate?: string;
  address: string;
  emergencyContact: {
    name: string;
    contactNumber: string;
  };
  aadharNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Payment Schema - Rent Income
export interface RentPayment {
  id: string;
  tenantId: string;
  roomId: string;
  month: string; // Format: 'YYYY-MM'
  dueDate: string;
  paidDate?: string;
  rentAmount: number;
  paidAmount: number;
  lateFee: number;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Expense Schema - All Expenses
export interface Expense {
  id: string;
  date: string; // ISO date string
  amount: number;
  category: ExpenseCategory;
  description: string;
  paymentMethod?: PaymentMethod;
  employeeId?: string; // Link to employee if salary expense
  receiptNumber?: string;
  vendorName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Financial Summary Interfaces
export interface IncomeExpenseSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  incomeBreakdown: {
    rentIncome: number;
    lateFees: number;
    deposits: number;
    other: number;
  };
  expenseBreakdown: {
    [key in ExpenseCategory]: number;
  };
  monthlyData: {
    month: string; // 'YYYY-MM'
    income: number;
    expenses: number;
    netProfit: number;
  }[];
}

export interface PaymentSummary {
  tenantId: string;
  tenantName: string;
  roomName: string;
  contactNumber: string;
  totalPending: number;
  totalOverdue: number;
  currentMonthStatus: PaymentStatus;
  lastPaymentDate?: string;
  overdueMonths: string[];
}

export interface DashboardSummary {
  totalRooms: number;
  occupiedRooms: number;
  totalBeds: number;
  occupiedBeds: number;
  occupancyRate: number;
  totalTenants: number;
  activeTenants: number;
  totalEmployees: number;
  activeEmployees: number;
  // Financial Summary
  currentMonthIncome: number;
  currentMonthExpenses: number;
  currentMonthProfit: number;
  pendingPayments: number;
  overduePayments: number;
  upcomingRentDues: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

// Sample Data
export const ROOMS_DATA: Room[] = [
  {
    id: '1',
    name: 'Room 101',
    type: RoomType.DOUBLE,
    floor: 1,
    totalBeds: 2,
    occupiedBeds: 1,
    monthlyRent: 8000,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Room 102',
    type: RoomType.TRIPLE,
    floor: 1,
    totalBeds: 3,
    occupiedBeds: 3,
    monthlyRent: 7000,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Room 201',
    type: RoomType.SINGLE,
    floor: 2,
    totalBeds: 1,
    occupiedBeds: 0,
    monthlyRent: 10000,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
];

export const TENANTS_DATA: Tenant[] = [
  {
    id: '1',
    name: 'John Doe',
    contactNumber: '+91 9876543210',
    email: 'john@example.com',
    roomId: '1',
    bedNumber: 1,
    joiningDate: '2023-01-15',
    rentDueDate: 15,
    securityDeposit: 16000,
    monthlyRent: 8000,
    status: TenantStatus.ACTIVE,
    emergencyContact: {
      name: 'Jane Doe',
      contactNumber: '+91 9876543220',
    },
    address: '123 Main St, Delhi',
    aadharNumber: '1234-5678-9012',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    contactNumber: '+91 9876543211',
    email: 'jane@example.com',
    roomId: '2',
    bedNumber: 1,
    joiningDate: '2023-03-01',
    rentDueDate: 1,
    securityDeposit: 14000,
    monthlyRent: 7000,
    status: TenantStatus.ACTIVE,
    emergencyContact: {
      name: 'Robert Smith',
      contactNumber: '+91 9876543221',
    },
    address: '456 Oak St, Mumbai',
    aadharNumber: '2345-6789-0123',
    createdAt: '2023-03-01T00:00:00Z',
    updatedAt: '2023-03-01T00:00:00Z',
  },
];

export const EMPLOYEES_DATA: Employee[] = [
  {
    id: '1',
    name: 'Ravi Kumar',
    contactNumber: '+91 9876543230',
    email: 'ravi@example.com',
    role: 'CLEANING_STAFF',
    salary: 15000,
    joiningDate: '2023-01-01',
    address: '789 Service St, Delhi',
    emergencyContact: {
      name: 'Sita Kumar',
      contactNumber: '+91 9876543240',
    },
    aadharNumber: '3456-7890-1234',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    contactNumber: '+91 9876543231',
    role: 'SECURITY',
    salary: 18000,
    joiningDate: '2023-02-01',
    address: '321 Guard St, Delhi',
    emergencyContact: {
      name: 'Raj Sharma',
      contactNumber: '+91 9876543241',
    },
    aadharNumber: '4567-8901-2345',
    isActive: true,
    createdAt: '2023-02-01T00:00:00Z',
    updatedAt: '2023-02-01T00:00:00Z',
  },
];

export const RENT_PAYMENTS_DATA: RentPayment[] = [
  {
    id: '1',
    tenantId: '1',
    roomId: '1',
    month: '2023-05',
    dueDate: '2023-05-15',
    paidDate: '2023-05-15',
    rentAmount: 8000,
    paidAmount: 8000,
    lateFee: 0,
    status: PaymentStatus.PAID,
    paymentMethod: PaymentMethod.UPI,
    createdAt: '2023-05-15T00:00:00Z',
    updatedAt: '2023-05-15T00:00:00Z',
  },
  {
    id: '2',
    tenantId: '2',
    roomId: '2',
    month: '2023-06',
    dueDate: '2023-06-01',
    rentAmount: 7000,
    paidAmount: 0,
    lateFee: 200,
    status: PaymentStatus.OVERDUE,
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2023-06-01T00:00:00Z',
  },
];

export const EXPENSES_DATA: Expense[] = [
  {
    id: '1',
    date: '2023-05-01',
    amount: 15000,
    category: ExpenseCategory.SALARY,
    description: 'Monthly Salary - Ravi Kumar',
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    employeeId: '1',
    createdAt: '2023-05-01T00:00:00Z',
    updatedAt: '2023-05-01T00:00:00Z',
  },
  {
    id: '2',
    date: '2023-05-01',
    amount: 18000,
    category: ExpenseCategory.SALARY,
    description: 'Monthly Salary - Priya Sharma',
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    employeeId: '2',
    createdAt: '2023-05-01T00:00:00Z',
    updatedAt: '2023-05-01T00:00:00Z',
  },
  {
    id: '3',
    date: '2023-05-03',
    amount: 3500,
    category: ExpenseCategory.UTILITY,
    description: 'Electricity Bill - May 2023',
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    vendorName: 'Delhi Electric Board',
    receiptNumber: 'DEB-2023-05-001',
    createdAt: '2023-05-03T00:00:00Z',
    updatedAt: '2023-05-03T00:00:00Z',
  },
  {
    id: '4',
    date: '2023-05-05',
    amount: 2000,
    category: ExpenseCategory.MAINTENANCE,
    description: 'Plumbing repair - Room 102',
    paymentMethod: PaymentMethod.CASH,
    vendorName: 'Kumar Plumbing Services',
    createdAt: '2023-05-05T00:00:00Z',
    updatedAt: '2023-05-05T00:00:00Z',
  },
  {
    id: '5',
    date: '2023-05-10',
    amount: 1500,
    category: ExpenseCategory.CLEANING,
    description: 'Cleaning supplies for May',
    paymentMethod: PaymentMethod.CASH,
    vendorName: 'Local Store',
    createdAt: '2023-05-10T00:00:00Z',
    updatedAt: '2023-05-10T00:00:00Z',
  },
  {
    id: '6',
    date: '2023-05-15',
    amount: 1200,
    category: ExpenseCategory.INTERNET,
    description: 'Internet Bill - May 2023',
    paymentMethod: PaymentMethod.UPI,
    vendorName: 'Airtel',
    receiptNumber: 'ATL-2023-05-001',
    createdAt: '2023-05-15T00:00:00Z',
    updatedAt: '2023-05-15T00:00:00Z',
  },
];
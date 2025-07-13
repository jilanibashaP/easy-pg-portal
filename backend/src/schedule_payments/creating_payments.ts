import cron from 'node-cron';
import { Tenant } from '../models/Tenant'; // Adjust path as needed
import { RentPayment } from '../models/RentPayment'; // Adjust path as needed
import { Op, Model } from 'sequelize';

// Types and Interfaces
interface MonthData {
  month: number;
  year: number;
  dueDate: Date;
}

interface OverduePaymentData {
  tenantName: string;
  roomName: string;
  contactNumber: string;
  month: number;
  dueDate: Date;
  rentAmount: number;
  paidAmount: number;
  lateFee: number;
  outstandingAmount: number;
  overdueDays: number;
}

interface OverdueReport {
  total: number;
  categories: {
    '0-30 days': number;
    '31-60 days': number;
    '61-90 days': number;
    '90+ days': number;
  };
  totalOverdueAmount: number;
  payments: OverduePaymentData[];
}

// Sequelize model interfaces
interface TenantAttributes {
  id: string;
  pgId: string;
  name: string;
  roomId: string;
  roomName: string;
  contactNumber: string;
  joiningDate: Date;
  rentDueDate: number;
  monthlyRent: number;
  status: 'ACTIVE' | 'INACTIVE' | 'LEFT';
  isActive: boolean;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  address?: string;
  aadharNumber?: string;
  email?: string;
  bedNumber: number;
  securityDeposit?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PaymentAttributes {
  id: string;
  pgId: string;
  tenantId: string;
  roomId: string;
  month: number;
  dueDate: Date;
  rentAmount: number;
  paidAmount: number;
  lateFee: number;
  status: 'PENDING' | 'PARTIAL' | 'PAID';
  createdAt: Date;
  updatedAt: Date;
}

// Sequelize model types
type TenantModel = Model<TenantAttributes> & TenantAttributes;
type PaymentModel = Model<PaymentAttributes> & PaymentAttributes;

// Extended payment model with tenant association
interface PaymentWithTenant extends PaymentModel {
  Tenant?: {
    name: string;
    roomName: string;
    contactNumber: string;
  };
}

/**
 * Gets all months between joining date and current date for a tenant
 */
const getMonthsToProcess = (
  joiningDate: Date, 
  currentDate: Date, 
  rentDueDate: number
): MonthData[] => {
  const months: MonthData[] = [];
  const startDate = new Date(joiningDate);
  const endDate = new Date(currentDate);
  
  // Start from the joining month
  let currentMonth = startDate.getMonth();
  let currentYear = startDate.getFullYear();
  
  while (currentYear < endDate.getFullYear() || 
         (currentYear === endDate.getFullYear() && currentMonth <= endDate.getMonth())) {
    
    const dueDate = new Date(currentYear, currentMonth, rentDueDate);
    
    // Only add if due date has passed
    if (dueDate <= currentDate) {
      months.push({
        month: currentMonth + 1, // Store as 1-based month
        year: currentYear,
        dueDate: dueDate
      });
    }
    
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
  }
  
  return months;
};

/**
 * Calculate late fee based on overdue days
 */
const calculateLateFee = (
  dueDate: Date, 
  currentDate: Date, 
  monthlyRent: number
): number => {
  const overdueDays = Math.floor((currentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (overdueDays <= 0) return 0;
  
  // Example late fee calculation - adjust as per your business logic
  // First 5 days: no late fee
  // 6-15 days: 2% of monthly rent
  // 16-30 days: 5% of monthly rent
  // 31+ days: 10% of monthly rent
  
  if (overdueDays <= 5) return 0;
  if (overdueDays <= 15) return Math.floor(monthlyRent * 0.02);
  if (overdueDays <= 30) return Math.floor(monthlyRent * 0.05);
  return Math.floor(monthlyRent * 0.10);
};

/**
 * Creates payment records for tenants whose rent is due (including overdue payments)
 */
const createRentDuePayments = async (pgId: string): Promise<void> => {
  try {
    console.log(`Starting comprehensive rent due check for PG: ${pgId}`);
    
    const currentDate = new Date();
    
    // Fetch all active tenants for the given PG
    const tenants = await Tenant.findAll({
      where: {
        pgId: pgId,
        status: 'ACTIVE',
        isActive: true
      }
    }) as TenantModel[];

    console.log(`Found ${tenants.length} active tenants for PG: ${pgId}`);
    
    let paymentsCreated = 0;
    let paymentsUpdated = 0;
    
    for (const tenant of tenants) {
      try {
        // Get all months that need to be processed for this tenant
        const monthsToProcess = getMonthsToProcess(
          new Date(tenant.joiningDate), 
          currentDate, 
          tenant.rentDueDate
        );
        
        console.log(`Processing ${monthsToProcess.length} months for tenant: ${tenant.name}`);
        
        for (const monthData of monthsToProcess) {
          // Check if payment record already exists
          const existingPayment = await RentPayment.findOne({
            where: {
              tenantId: tenant.id,
              month: monthData.month,
              dueDate: monthData.dueDate
            }
          }) as PaymentModel | null;
          
          if (!existingPayment) {
            // Calculate late fee if overdue
            const lateFee = calculateLateFee(monthData.dueDate, currentDate, tenant.monthlyRent);
            
            // Create new payment record
            const payment = await RentPayment.create({
              pgId: tenant.pgId,
              tenantId: tenant.id,
              roomId: tenant.roomId,
              month: `${monthData.month}`,
              dueDate: monthData.dueDate,
              rentAmount: tenant.monthlyRent,
              paidAmount: 0,
              lateFee: lateFee,
              status: 'PENDING'
            });
            
            paymentsCreated++;
            console.log(`Created payment record for tenant: ${tenant.name}, Month: ${monthData.month}/${monthData.year}, Late Fee: ${lateFee}`);
            
          } else {
            // Update late fee for existing unpaid records
            if (existingPayment.status === 'PENDING' || existingPayment.status === 'PARTIAL') {
              const newLateFee = calculateLateFee(monthData.dueDate, currentDate, tenant.monthlyRent);
              
              if (newLateFee !== existingPayment.lateFee) {
                await existingPayment.update({ lateFee: newLateFee });
                paymentsUpdated++;
                console.log(`Updated late fee for tenant: ${tenant.name}, Month: ${monthData.month}/${monthData.year}, New Late Fee: ${newLateFee}`);
              }
            }
          }
        }
        
      } catch (tenantError) {
        console.error(`Error processing tenant ${tenant.name} (ID: ${tenant.id}):`, tenantError);
      }
    }
    
    console.log(`Rent due check completed for PG: ${pgId}. Created: ${paymentsCreated}, Updated: ${paymentsUpdated} payment records.`);
    
  } catch (error) {
    console.error(`Error in createRentDuePayments for PG ${pgId}:`, error);
  }
};

/**
 * Main function to process rent due payments for all PGs
 */
const processRentDuePayments = async (): Promise<void> => {
  try {
    console.log('Starting comprehensive rent due payment processing...');
    
    // Get all unique PG IDs from active tenants
    const uniquePgIds = await Tenant.findAll({
      attributes: ['pgId'],
      where: {
        status: 'ACTIVE',
        isActive: true
      },
      group: ['pgId'],
      raw: true
    }) as unknown as { pgId: string }[];
    
    console.log(`Found ${uniquePgIds.length} unique PGs to process`);
    
    // Process each PG
    for (const pgData of uniquePgIds) {
      await createRentDuePayments(pgData.pgId);
    }
    
    console.log('Comprehensive rent due payment processing completed successfully');
    
  } catch (error) {
    console.error('Error in processRentDuePayments:', error);
  }
};

/**
 * Cron job that runs daily at 9:00 AM
 */
const startRentDueCronJob = (): void => {
  // Run every day at 9:00 AM
  cron.schedule('0 0 9 * * *', async () => {
    console.log('Rent due cron job triggered at:', new Date().toISOString());
    await processRentDuePayments();
  }, {
    timezone: "Asia/Kolkata" // Adjust timezone as needed
  });
};
  
/**
 * Manual trigger function for testing
 */
const triggerRentDueCheck = async (pgId: string | null = null): Promise<void> => {
  if (pgId) {
    await createRentDuePayments(pgId);
    // await generateOverdueReport(pgId);
  } else {
    await processRentDuePayments();
  }
};

// Export functions
export {
  startRentDueCronJob,
  triggerRentDueCheck,
  processRentDuePayments,
  createRentDuePayments,
};

// Export types
export type {
  MonthData,
  OverduePaymentData,
  OverdueReport,
  TenantAttributes,
  PaymentAttributes,
  TenantModel,
  PaymentModel,
  PaymentWithTenant
};
startRentDueCronJob();

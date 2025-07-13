// import cron from 'node-cron';
// import { Tenant } from '../models/Tenant'; // Adjust path as needed
// import { RentPayment } from '../models/RentPayment'; // Adjust path as needed
// import { Op, Model } from 'sequelize';

// // Types and Interfaces
// interface MonthData {
//   month: number;
//   year: number;
//   dueDate: Date;
// }

// interface OverduePaymentData {
//   tenantName: string;
//   roomName: string;
//   contactNumber: string;
//   month: number;
//   dueDate: Date;
//   rentAmount: number;
//   paidAmount: number;
//   lateFee: number;
//   outstandingAmount: number;
//   overdueDays: number;
// }

// interface OverdueReport {
//   total: number;
//   categories: {
//     '0-30 days': number;
//     '31-60 days': number;
//     '61-90 days': number;
//     '90+ days': number;
//   };
//   totalOverdueAmount: number;
//   payments: OverduePaymentData[];
// }

// // Sequelize model interfaces
// interface TenantAttributes {
//   id: string;
//   pgId: string;
//   name: string;
//   roomId: string;
//   roomName: string;
//   contactNumber: string;
//   joiningDate: Date;
//   rentDueDate: number;
//   monthlyRent: number;
//   status: 'ACTIVE' | 'INACTIVE' | 'LEFT';
//   isActive: boolean;
//   emergencyContactName?: string;
//   emergencyContactNumber?: string;
//   address?: string;
//   aadharNumber?: string;
//   email?: string;
//   bedNumber: number;
//   securityDeposit?: number;
//   createdAt: Date;
//   updatedAt: Date;
// }

// interface PaymentAttributes {
//   id: string;
//   pgId: string;
//   tenantId: string;
//   roomId: string;
//   month: number;
//   dueDate: Date;
//   rentAmount: number;
//   paidAmount: number;
//   lateFee: number;
//   status: 'PENDING' | 'PARTIAL' | 'PAID';
//   createdAt: Date;
//   updatedAt: Date;
// }

// // Sequelize model types
// type TenantModel = Model<TenantAttributes> & TenantAttributes;
// type PaymentModel = Model<PaymentAttributes> & PaymentAttributes;

// // Extended payment model with tenant association
// interface PaymentWithTenant extends PaymentModel {
//   Tenant?: {
//     name: string;
//     roomName: string;
//     contactNumber: string;
//   };
// }

// /**
//  * Gets all months between joining date and current date for a tenant
//  */
// const getMonthsToProcess = (
//   joiningDate: Date, 
//   currentDate: Date, 
//   rentDueDate: number
// ): MonthData[] => {
//   const months: MonthData[] = [];
//   const startDate = new Date(joiningDate);
//   const endDate = new Date(currentDate);
  
//   // Start from the joining month
//   let currentMonth = startDate.getMonth();
//   let currentYear = startDate.getFullYear();
  
//   while (currentYear < endDate.getFullYear() || 
//          (currentYear === endDate.getFullYear() && currentMonth <= endDate.getMonth())) {
    
//     const dueDate = new Date(currentYear, currentMonth, rentDueDate);
    
//     // Only add if due date has passed
//     if (dueDate <= currentDate) {
//       months.push({
//         month: currentMonth + 1, // Store as 1-based month
//         year: currentYear,
//         dueDate: dueDate
//       });
//     }
    
//     currentMonth++;
//     if (currentMonth > 11) {
//       currentMonth = 0;
//       currentYear++;
//     }
//   }
  
//   return months;
// };

// /**
//  * Calculate late fee based on overdue days
//  */
// const calculateLateFee = (
//   dueDate: Date, 
//   currentDate: Date, 
//   monthlyRent: number
// ): number => {
//   const overdueDays = Math.floor((currentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
  
//   if (overdueDays <= 0) return 0;
  
//   // Example late fee calculation - adjust as per your business logic
//   // First 5 days: no late fee
//   // 6-15 days: 2% of monthly rent
//   // 16-30 days: 5% of monthly rent
//   // 31+ days: 10% of monthly rent
  
//   if (overdueDays <= 5) return 0;
//   if (overdueDays <= 15) return Math.floor(monthlyRent * 0.02);
//   if (overdueDays <= 30) return Math.floor(monthlyRent * 0.05);
//   return Math.floor(monthlyRent * 0.10);
// };

// /**
//  * Creates payment records for tenants whose rent is due (including overdue payments)
//  */
// const createRentDuePayments = async (pgId: string): Promise<void> => {
//   try {
//     console.log(`Starting comprehensive rent due check for PG: ${pgId}`);
    
//     const currentDate = new Date();
    
//     // Fetch all active tenants for the given PG
//     const tenants = await Tenant.findAll({
//       where: {
//         pgId: pgId,
//         status: 'ACTIVE',
//         isActive: true
//       }
//     }) as TenantModel[];

//     console.log(`Found ${tenants.length} active tenants for PG: ${pgId}`);
    
//     let paymentsCreated = 0;
//     let paymentsUpdated = 0;
    
//     for (const tenant of tenants) {
//       try {
//         // Get all months that need to be processed for this tenant
//         const monthsToProcess = getMonthsToProcess(
//           new Date(tenant.joiningDate), 
//           currentDate, 
//           tenant.rentDueDate
//         );
        
//         console.log(`Processing ${monthsToProcess.length} months for tenant: ${tenant.name}`);
        
//         for (const monthData of monthsToProcess) {
//           // Check if payment record already exists
//           const existingPayment = await RentPayment.findOne({
//             where: {
//               tenantId: tenant.id,
//               month: monthData.month,
//               dueDate: monthData.dueDate
//             }
//           }) as PaymentModel | null;
          
//           if (!existingPayment) {
//             // Calculate late fee if overdue
//             const lateFee = calculateLateFee(monthData.dueDate, currentDate, tenant.monthlyRent);
            
//             // Create new payment record
//             const payment = await RentPayment.create({
//               pgId: tenant.pgId,
//               tenantId: tenant.id,
//               roomId: tenant.roomId,
//               month: monthData.month,
//               dueDate: monthData.dueDate,
//               rentAmount: tenant.monthlyRent,
//               paidAmount: 0,
//               lateFee: lateFee,
//               status: 'PENDING'
//             });
            
//             paymentsCreated++;
//             console.log(`Created payment record for tenant: ${tenant.name}, Month: ${monthData.month}/${monthData.year}, Late Fee: ${lateFee}`);
            
//           } else {
//             // Update late fee for existing unpaid records
//             if (existingPayment.status === 'PENDING' || existingPayment.status === 'PARTIAL') {
//               const newLateFee = calculateLateFee(monthData.dueDate, currentDate, tenant.monthlyRent);
              
//               if (newLateFee !== existingPayment.lateFee) {
//                 await existingPayment.update({ lateFee: newLateFee });
//                 paymentsUpdated++;
//                 console.log(`Updated late fee for tenant: ${tenant.name}, Month: ${monthData.month}/${monthData.year}, New Late Fee: ${newLateFee}`);
//               }
//             }
//           }
//         }
        
//       } catch (tenantError) {
//         console.error(`Error processing tenant ${tenant.name} (ID: ${tenant.id}):`, tenantError);
//       }
//     }
    
//     console.log(`Rent due check completed for PG: ${pgId}. Created: ${paymentsCreated}, Updated: ${paymentsUpdated} payment records.`);
    
//   } catch (error) {
//     console.error(`Error in createRentDuePayments for PG ${pgId}:`, error);
//   }
// };

// /**
//  * Generate overdue payment report
//  */
// // const generateOverdueReport = async (pgId: string): Promise<OverdueReport> => {
// //   try {
// //     const currentDate = new Date();
// //     const thirtyDaysAgo = new Date(currentDate.getTime() - (30 * 24 * 60 * 60 * 1000));
// //     const sixtyDaysAgo = new Date(currentDate.getTime() - (60 * 24 * 60 * 60 * 1000));
// //     const ninetyDaysAgo = new Date(currentDate.getTime() - (90 * 24 * 60 * 60 * 1000));
    
// //     // Fetch overdue rent payments with tenant information
// //     const rentPayments = await RentPayment.findAll({
// //       include: [{
// //         model: Tenant,
// //         where: { pgId: pgId },
// //         attributes: ['name', 'roomName', 'contactNumber']
// //       }],
// //       where: {
// //         status: {
// //           [Op.in]: ['PENDING', 'PARTIAL']
// //         },
// //         dueDate: {
// //           [Op.lt]: currentDate
// //         }
// //       },
// //       order: [['dueDate', 'ASC']]
// //     });
    
// //     // Transform RentPayment[] to PaymentWithTenant[] with proper type conversion
// //     const overduePayments: PaymentWithTenant[] = rentPayments.map(payment => {
// //       const paymentData = payment.toJSON();
// //       return {
// //         ...paymentData,
// //         month: typeof paymentData.month === 'string' ? parseInt(paymentData.month) : paymentData.month,
// //         Tenant: payment.Tenant
// //       };
// //     });
    
// //     // Calculate category counts
// //     const categories = {
// //       '0-30 days': overduePayments.filter(p => p.dueDate >= thirtyDaysAgo).length,
// //       '31-60 days': overduePayments.filter(p => p.dueDate >= sixtyDaysAgo && p.dueDate < thirtyDaysAgo).length,
// //       '61-90 days': overduePayments.filter(p => p.dueDate >= ninetyDaysAgo && p.dueDate < sixtyDaysAgo).length,
// //       '90+ days': overduePayments.filter(p => p.dueDate < ninetyDaysAgo).length
// //     };
    
// //     // Calculate total overdue amount
// //     const totalOverdueAmount = overduePayments.reduce((sum, payment) => {
// //       const outstanding = payment.rentAmount - payment.paidAmount + payment.lateFee;
// //       return sum + outstanding;
// //     }, 0);
    
// //     // Map payments to the required format
// //     const paymentsWithDetails = overduePayments.map(payment => {
// //       const overdueDays = Math.floor((currentDate.getTime() - payment.dueDate.getTime()) / (1000 * 60 * 60 * 24));
// //       const outstandingAmount = payment.rentAmount - payment.paidAmount + payment.lateFee;
      
// //       return {
// //         tenantName: payment.Tenant?.name || 'Unknown',
// //         roomName: payment.Tenant?.roomName || 'Unknown',
// //         contactNumber: payment.Tenant?.contactNumber || 'Unknown',
// //         month: payment.month,
// //         dueDate: payment.dueDate,
// //         rentAmount: payment.rentAmount,
// //         paidAmount: payment.paidAmount,
// //         lateFee: payment.lateFee,
// //         outstandingAmount,
// //         overdueDays
// //       };
// //     });
    
// //     // Create the final report
// //     const report: OverdueReport = {
// //       total: overduePayments.length,
// //       categories,
// //       totalOverdueAmount,
// //       payments: paymentsWithDetails
// //     };
    
// //     // Log report summary
// //     console.log('Overdue Report for PG:', pgId);
// //     console.log('Total Overdue Payments:', report.total);
// //     console.log('Category Breakdown:', report.categories);
// //     console.log('Total Outstanding Amount:', report.totalOverdueAmount);
    
// //     return report;
    
// //   } catch (error) {
// //     console.error('Error generating overdue report:', error);
// //     throw error;
// //   }
// // };

// /**
//  * Main function to process rent due payments for all PGs
//  */
// const processRentDuePayments = async (): Promise<void> => {
//   try {
//     console.log('Starting comprehensive rent due payment processing...');
    
//     // Get all unique PG IDs from active tenants
//     const uniquePgIds = await Tenant.findAll({
//       attributes: ['pgId'],
//       where: {
//         status: 'ACTIVE',
//         isActive: true
//       },
//       group: ['pgId'],
//       raw: true
//     }) as unknown as { pgId: string }[];
    
//     console.log(`Found ${uniquePgIds.length} unique PGs to process`);
    
//     // Process each PG
//     for (const pgData of uniquePgIds) {
//       await createRentDuePayments(pgData.pgId);
      
//       // Generate overdue report for each PG
//       // await generateOverdueReport(pgData.pgId);
//     }
    
//     console.log('Comprehensive rent due payment processing completed successfully');
    
//   } catch (error) {
//     console.error('Error in processRentDuePayments:', error);
//   }
// };

// /**
//  * Cron job that runs daily at 9:00 AM
//  */
// const startRentDueCronJob = (): void => {
//   // Run every day at 9:00 AM
//   cron.schedule('0 0 9 * * *', async () => {
//     console.log('Rent due cron job triggered at:', new Date().toISOString());
//     await processRentDuePayments();
//   }, {
//     timezone: "Asia/Kolkata" // Adjust timezone as needed
//   });
// };
  
//   // // Weekly overdue report on Mondays at 10:00 AM
//   // cron.schedule('0 0 10 * * 1', async () => {
//   //   console.log('Weekly overdue report triggered at:', new Date().toISOString());
//   //   const uniquePgIds = await Tenant.findAll({
//   //     attributes: ['pgId'],
//   //     where: { status: 'ACTIVE', isActive: true },
//   //     group: ['pgId']
//   //   }) as Array<Pick<TenantModel, 'pgId'>>;
    
//   //   for (const pgData of uniquePgIds) {
//   //     await generateOverdueReport(pgData.pgId);
//   //   }
//   // }, {
//   //   scheduled: true,
//   //   timezone: "Asia/Kolkata"
//   // });
  
// //   console.log('Rent due cron jobs scheduled:');
// //   console.log('- Daily payment processing at 9:00 AM');
// //   console.log('- Weekly overdue report on Mondays at 10:00 AM');
// // };

// /**
//  * Manual trigger function for testing
//  */
// const triggerRentDueCheck = async (pgId: string | null = null): Promise<void> => {
//   if (pgId) {
//     await createRentDuePayments(pgId);
//     // await generateOverdueReport(pgId);
//   } else {
//     await processRentDuePayments();
//   }
// };

// /**
//  * Get overdue tenants for a specific PG
//  */
// // const getOverdueTenants = async (pgId: string): Promise<OverduePaymentData[]> => {
// //   try {
// //     const report = await generateOverdueReport(pgId);
// //     return report.payments.filter(p => p.overdueDays > 0);
// //   } catch (error) {
// //     console.error('Error getting overdue tenants:', error);
// //     throw error;
// //   }
// // };

// /**
//  * Get payment statistics for a PG
//  */
// // const getPaymentStatistics = async (pgId: string): Promise<{
// //   totalTenants: number;
// //   activePayments: number;
// //   overduePayments: number;
// //   totalOutstanding: number;
// //   avgOverdueDays: number;
// // }> => {
// //   try {
// //     const report = await generateOverdueReport(pgId);
// //     const tenants = await Tenant.findAll({
// //       where: { pgId: pgId, status: 'ACTIVE', isActive: true }
// //     }) as TenantModel[];
    
// //     const activePayments = await RentPayment.count({
// //       where: { pgId: pgId, status: 'PAID' }
// //     });
    
// //     const avgOverdueDays = report.payments.length > 0 
// //       ? report.payments.reduce((sum, p) => sum + p.overdueDays, 0) / report.payments.length 
// //       : 0;
    
// //     return {
// //       totalTenants: tenants.length,
// //       activePayments: activePayments,
// //       overduePayments: report.total,
// //       totalOutstanding: report.totalOverdueAmount,
// //       avgOverdueDays: Math.round(avgOverdueDays)
// //     };
    
// //   } catch (error) {
// //     console.error('Error getting payment statistics:', error);
// //     throw error;
// //   }
// // };

// // Export functions
// export {
//   startRentDueCronJob,
//   triggerRentDueCheck,
//   processRentDuePayments,
//   createRentDuePayments,
//   // generateOverdueReport,
//   // getOverdueTenants,
//   // getPaymentStatistics
// };

// // Export types
// export type {
//   MonthData,
//   OverduePaymentData,
//   OverdueReport,
//   TenantAttributes,
//   PaymentAttributes,
//   TenantModel,
//   PaymentModel,
//   PaymentWithTenant
// };

// // Auto-start the cron job when this module is imported
// // Comment out if you want to start manually
// startRentDueCronJob();
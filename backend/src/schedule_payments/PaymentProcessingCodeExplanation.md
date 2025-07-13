# Rent Payment Processing Code Explanation

## Overview
This code automates rent payment management for PG (Paying Guest) accommodations. It creates payment records, calculates late fees, and runs on a scheduled basis to ensure all rent payments are tracked properly.

## Function-by-Function Breakdown

### 1. `getMonthsToProcess()` - Month Calculation Logic

**What it does**: Figures out which months need payment records for a tenant

**How it works**:
```javascript
const getMonthsToProcess = (joiningDate, currentDate, rentDueDate) => {
  // Creates empty array to store months
  const months = [];
  
  // Sets up loop variables starting from joining month/year
  let currentMonth = startDate.getMonth();
  let currentYear = startDate.getFullYear();
  
  // Loops through each month from joining date to current date
  while (currentYear < endDate.getFullYear() || 
         (currentYear === endDate.getFullYear() && currentMonth <= endDate.getMonth())) {
    
    // Creates due date for this month (e.g., 5th of January 2024)
    const dueDate = new Date(currentYear, currentMonth, rentDueDate);
    
    // Only adds months where due date has already passed
    if (dueDate <= currentDate) {
      months.push({
        month: currentMonth + 1, // Converts to 1-12 format
        year: currentYear,
        dueDate: dueDate
      });
    }
    
    // Moves to next month
    currentMonth++;
    if (currentMonth > 11) { // If December, go to January of next year
      currentMonth = 0;
      currentYear++;
    }
  }
  
  return months;
};
```

**Example**: If tenant joined on March 15, 2024, and rent is due on 5th of each month, it will return:
- March 2024 (due: March 5)
- April 2024 (due: April 5)
- May 2024 (due: May 5)
- ... and so on until current month

### 2. `calculateLateFee()` - Late Fee Calculation

**What it does**: Calculates penalty fees for overdue payments

**How it works**:
```javascript
const calculateLateFee = (dueDate, currentDate, monthlyRent) => {
  // Calculates how many days payment is overdue
  const overdueDays = Math.floor((currentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // No late fee if not overdue
  if (overdueDays <= 0) return 0;
  
  // Progressive penalty structure:
  if (overdueDays <= 5) return 0;           // Grace period: 0%
  if (overdueDays <= 15) return monthlyRent * 0.02;  // 6-15 days: 2%
  if (overdueDays <= 30) return monthlyRent * 0.05;  // 16-30 days: 5%
  return monthlyRent * 0.10;                         // 31+ days: 10%
};
```

**Example**: If rent is ₹10,000 and payment is 20 days late:
- Late fee = ₹10,000 × 0.05 = ₹500

### 3. `createRentDuePayments()` - Core Payment Processing

**What it does**: Creates and updates payment records for all tenants in a specific PG

**Step-by-step process**:

1. **Fetch Active Tenants**:
   ```javascript
   const tenants = await Tenant.findAll({
     where: {
       pgId: pgId,           // Specific PG
       status: 'ACTIVE',     // Only active tenants
       isActive: true
     }
   });
   ```

2. **For Each Tenant**:
   - Gets all months that need payment records using `getMonthsToProcess()`
   - Processes each month individually

3. **For Each Month**:
   - **Checks if payment record exists**:
     ```javascript
     const existingPayment = await RentPayment.findOne({
       where: {
         tenantId: tenant.id,
         month: monthData.month.toString(),
         dueDate: monthData.dueDate
       }
     });
     ```

   - **If NO existing record**:
     - Calculates late fee
     - Creates new payment record with status 'PENDING'
     - Sets paidAmount to 0
     
   - **If record EXISTS and is unpaid**:
     - Recalculates late fee (in case it increased)
     - Updates the record if late fee changed

4. **Tracks Progress**:
   - Counts how many payments were created vs updated
   - Logs detailed information for monitoring

### 4. `processRentDuePayments()` - System-wide Processing

**What it does**: Runs payment processing for ALL PGs in the system

**How it works**:
```javascript
const processRentDuePayments = async () => {
  // 1. Find all unique PG IDs that have active tenants
  const uniquePgIds = await Tenant.findAll({
    attributes: ['pgId'],
    where: { status: 'ACTIVE', isActive: true },
    group: ['pgId'],  // Gets unique PG IDs only
    raw: true
  });
  
  // 2. Process each PG one by one
  for (const pgData of uniquePgIds) {
    await createRentDuePayments(pgData.pgId);
  }
};
```

### 5. `startRentDueCronJob()` - Automated Scheduling

**What it does**: Sets up automatic execution of payment processing

**Current Configuration**:
```javascript
// Currently set to run every 3 minutes for testing
cron.schedule('*/3 * * * *', async () => {
  console.log('Rent due cron job triggered at:', new Date().toISOString());
  await processRentDuePayments();
}, {
  timezone: "Asia/Kolkata"
});
```

**Production Configuration** (commented out):
```javascript
// Would run daily at 9:00 AM
cron.schedule('0 0 9 * * *', async () => {
  await processRentDuePayments();
}, {
  timezone: "Asia/Kolkata"
});
```

### 6. `triggerRentDueCheck()` - Manual Testing

**What it does**: Allows manual execution for testing purposes

**Usage**:
- `triggerRentDueCheck('PG123')` - Process specific PG
- `triggerRentDueCheck()` - Process all PGs

## Real-World Example

Let's say we have:
- **Tenant**: John, joined March 15, 2024
- **Rent**: ₹10,000 per month, due on 5th of each month
- **Current Date**: May 20, 2024

**What happens when code runs**:

1. **getMonthsToProcess()** returns:
   - March 2024 (due: March 5)
   - April 2024 (due: April 5)  
   - May 2024 (due: May 5)

2. **For March payment**:
   - Due date was March 5, now it's May 20 (75 days overdue)
   - Late fee = ₹10,000 × 0.10 = ₹1,000
   - Creates record: rentAmount=₹10,000, lateFee=₹1,000, status='PENDING'

3. **For April payment**:
   - Due date was April 5, now it's May 20 (45 days overdue)
   - Late fee = ₹10,000 × 0.10 = ₹1,000
   - Creates record: rentAmount=₹10,000, lateFee=₹1,000, status='PENDING'

4. **For May payment**:
   - Due date was May 5, now it's May 20 (15 days overdue)
   - Late fee = ₹10,000 × 0.02 = ₹200
   - Creates record: rentAmount=₹10,000, lateFee=₹200, status='PENDING'

## Key Features

- **Automatic Payment Record Creation**: No manual intervention needed
- **Progressive Late Fees**: Penalties increase with delay
- **Idempotent**: Running multiple times won't create duplicates
- **Dynamic Late Fee Updates**: Recalculates fees on each run
- **Comprehensive Logging**: Tracks all operations for monitoring
- **Error Handling**: Continues processing even if one tenant fails
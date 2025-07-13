# Expense Management API Documentation

## Overview
This API provides endpoints for managing expenses in a PG (Paying Guest) management system. It supports operations for creating, reading, updating, and deleting expense records with various filtering options.

## Base URL
```
/api/expenses
```

## Data Models

### Expense Model
```typescript
interface Expense {
  id: string;              // UUID (Primary Key)
  pgId: string;            // UUID (Link to PG)
  date: string;            // Date in YYYY-MM-DD format
  amount: number;          // Integer amount
  category: 'SALARY' | 'UTILITY' | 'MAINTENANCE' | 'CLEANING' | 'INTERNET' | 'OTHER';
  description?: string;    // Optional description
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'UPI';
  employeeId?: string;     // Optional UUID of employee who made payment
  vendorName?: string;     // Optional vendor name
  receiptNumber?: string;  // Optional receipt number
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
}
```

## Endpoints

### 1. Get All Expenses
Retrieve all expenses with optional filtering.

**Endpoint:** `GET /api/expenses`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| pgId | string | No | Filter by PG ID |
| startDate | string | No | Filter from date (YYYY-MM-DD) |
| endDate | string | No | Filter to date (YYYY-MM-DD) |
| category | string | No | Filter by category (SALARY, UTILITY, MAINTENANCE, CLEANING, INTERNET, OTHER) |
| paymentMethod | string | No | Filter by payment method (CASH, BANK_TRANSFER, UPI) |
| employeeId | string | No | Filter by employee ID |

**Example Request:**
```bash
GET /api/expenses?pgId=123e4567-e89b-12d3-a456-426614174000&startDate=2024-01-01&endDate=2024-12-31&category=SALARY
```

**Success Response (200):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "pgId": "123e4567-e89b-12d3-a456-426614174000",
    "date": "2024-01-15",
    "amount": 25000,
    "category": "SALARY",
    "description": "Monthly salary for cook",
    "paymentMethod": "BANK_TRANSFER",
    "employeeId": "emp123",
    "vendorName": null,
    "receiptNumber": "SAL001",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### 2. Get Expense by ID
Retrieve a specific expense by its ID.

**Endpoint:** `GET /api/expenses/:id`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Expense ID (UUID) |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| pgId | string | No | Filter by PG ID for security |

**Example Request:**
```bash
GET /api/expenses/550e8400-e29b-41d4-a716-446655440000?pgId=123e4567-e89b-12d3-a456-426614174000
```

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "pgId": "123e4567-e89b-12d3-a456-426614174000",
  "date": "2024-01-15",
  "amount": 25000,
  "category": "SALARY",
  "description": "Monthly salary for cook",
  "paymentMethod": "BANK_TRANSFER",
  "employeeId": "emp123",
  "vendorName": null,
  "receiptNumber": "SAL001",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (404):**
```json
{
  "error": "Not found"
}
```

### 3. Get Expenses by Employee
Retrieve expenses made by a specific employee.

**Endpoint:** `GET /api/expenses/employee/:employeeId`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| employeeId | string | Yes | Employee ID (UUID) |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| pgId | string | No | Filter by PG ID |
| startDate | string | No | Filter from date (YYYY-MM-DD) |
| endDate | string | No | Filter to date (YYYY-MM-DD) |
| category | string | No | Filter by category |

**Example Request:**
```bash
GET /api/expenses/employee/emp123?pgId=123e4567-e89b-12d3-a456-426614174000&startDate=2024-01-01&endDate=2024-01-31
```

**Success Response (200):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "pgId": "123e4567-e89b-12d3-a456-426614174000",
    "date": "2024-01-15",
    "amount": 25000,
    "category": "SALARY",
    "description": "Monthly salary for cook",
    "paymentMethod": "BANK_TRANSFER",
    "employeeId": "emp123",
    "vendorName": null,
    "receiptNumber": "SAL001",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### 4. Get Expenses by Date Range
Retrieve expenses within a specific date range.

**Endpoint:** `GET /api/expenses/date-range`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| startDate | string | Yes | Start date (YYYY-MM-DD) |
| endDate | string | Yes | End date (YYYY-MM-DD) |
| pgId | string | No | Filter by PG ID |
| category | string | No | Filter by category |
| paymentMethod | string | No | Filter by payment method |

**Example Request:**
```bash
GET /api/expenses/date-range?startDate=2024-01-01&endDate=2024-01-31&pgId=123e4567-e89b-12d3-a456-426614174000&category=UTILITY
```

**Success Response (200):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "pgId": "123e4567-e89b-12d3-a456-426614174000",
    "date": "2024-01-10",
    "amount": 5000,
    "category": "UTILITY",
    "description": "Electricity bill",
    "paymentMethod": "UPI",
    "employeeId": "emp456",
    "vendorName": "Power Company",
    "receiptNumber": "ELEC001",
    "createdAt": "2024-01-10T14:20:00.000Z",
    "updatedAt": "2024-01-10T14:20:00.000Z"
  }
]
```

**Error Response (400):**
```json
{
  "error": "Both startDate and endDate are required"
}
```

### 5. Create Expense
Create a new expense record.

**Endpoint:** `POST /api/expenses`

**Request Body:**
```json
{
  "pgId": "123e4567-e89b-12d3-a456-426614174000",
  "date": "2024-01-15",
  "amount": 1500,
  "category": "MAINTENANCE",
  "description": "Plumbing repair",
  "paymentMethod": "CASH",
  "employeeId": "emp789",
  "vendorName": "Local Plumber",
  "receiptNumber": "PLB001"
}
```

**Required Fields:**
- `pgId` (string): PG ID
- `date` (string): Date in YYYY-MM-DD format
- `amount` (number): Expense amount
- `category` (string): Expense category
- `paymentMethod` (string): Payment method

**Success Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "pgId": "123e4567-e89b-12d3-a456-426614174000",
  "date": "2024-01-15",
  "amount": 1500,
  "category": "MAINTENANCE",
  "description": "Plumbing repair",
  "paymentMethod": "CASH",
  "employeeId": "emp789",
  "vendorName": "Local Plumber",
  "receiptNumber": "PLB001",
  "createdAt": "2024-01-15T16:45:00.000Z",
  "updatedAt": "2024-01-15T16:45:00.000Z"
}
```

**Error Response (400):**
```json
{
  "error": "date, amount, category, and paymentMethod are required"
}
```

### 6. Update Expense
Update an existing expense record.

**Endpoint:** `PUT /api/expenses/:id`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Expense ID (UUID) |

**Request Body:**
```json
{
  "pgId": "123e4567-e89b-12d3-a456-426614174000",
  "amount": 1800,
  "description": "Updated plumbing repair cost",
  "vendorName": "Professional Plumber"
}
```

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "pgId": "123e4567-e89b-12d3-a456-426614174000",
  "date": "2024-01-15",
  "amount": 1800,
  "category": "MAINTENANCE",
  "description": "Updated plumbing repair cost",
  "paymentMethod": "CASH",
  "employeeId": "emp789",
  "vendorName": "Professional Plumber",
  "receiptNumber": "PLB001",
  "createdAt": "2024-01-15T16:45:00.000Z",
  "updatedAt": "2024-01-15T17:20:00.000Z"
}
```

**Error Response (404):**
```json
{
  "error": "Not found"
}
```

### 7. Delete Expense
Delete an expense record.

**Endpoint:** `DELETE /api/expenses/:id`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Expense ID (UUID) |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| pgId | string | No | PG ID for security filtering |

**Example Request:**
```bash
DELETE /api/expenses/550e8400-e29b-41d4-a716-446655440002?pgId=123e4567-e89b-12d3-a456-426614174000
```

**Success Response (200):**
```json
{
  "message": "Deleted"
}
```

**Error Response (404):**
```json
{
  "error": "Not found"
}
```

## Error Responses

All endpoints may return the following error responses:

**Internal Server Error (500):**
```json
{
  "error": "Internal server error"
}
```

## Usage Examples

### Common Use Cases

1. **Get all expenses for a PG:**
   ```bash
   GET /api/expenses?pgId=123e4567-e89b-12d3-a456-426614174000
   ```

2. **Get monthly salary expenses:**
   ```bash
   GET /api/expenses?pgId=123e4567-e89b-12d3-a456-426614174000&category=SALARY&startDate=2024-01-01&endDate=2024-01-31
   ```

3. **Get expenses made by a specific employee:**
   ```bash
   GET /api/expenses/employee/emp123?pgId=123e4567-e89b-12d3-a456-426614174000
   ```

4. **Get utility bills for a date range:**
   ```bash
   GET /api/expenses/date-range?startDate=2024-01-01&endDate=2024-03-31&category=UTILITY&pgId=123e4567-e89b-12d3-a456-426614174000
   ```

5. **Create a new expense:**
   ```bash
   POST /api/expenses
   Content-Type: application/json
   
   {
     "pgId": "123e4567-e89b-12d3-a456-426614174000",
     "date": "2024-01-20",
     "amount": 800,
     "category": "CLEANING",
     "description": "Monthly cleaning supplies",
     "paymentMethod": "UPI",
     "employeeId": "emp456",
     "vendorName": "Cleaning Store",
     "receiptNumber": "CLN001"
   }
   ```

## Notes

- All dates should be in `YYYY-MM-DD` format
- Amount is stored as integer (in smallest currency unit, e.g., paise for INR)
- The `pgId` parameter is used for data isolation between different PGs
- Results are ordered by date in descending order (newest first)
- All endpoints support filtering by `pgId` for security and data segregation
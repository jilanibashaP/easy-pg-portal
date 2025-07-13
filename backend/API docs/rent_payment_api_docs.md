# Rent Payment Management API Documentation

## Overview
This API provides comprehensive rent payment management functionality for PG (Paying Guest) accommodations, including payment tracking, analytics, notifications, and dashboard features.

**Base URL**: `https://api.yourpgapp.com/v1`

---

## Authentication
All endpoints require authentication. Include the authorization token in the header:
```
Authorization: Bearer <your_token>
```

---

## Response Format
All responses follow this standard format:
```json
{
  "success": boolean,
  "message": string,
  "data": object | array,
  "pagination": object (for paginated responses)
}
```

---

## 1. Payment Creation & Management

### Create Payment
Creates a new rent payment record for a billing cycle.

**Endpoint**: `POST /payments`

**Request Body**:
```json
{
  "pgId": "string",
  "tenantId": "string", 
  "roomId": "string",
  "month": "string", // YYYY-MM format
  "dueDate": "string", // ISO date format
  "rentAmount": number
}
```

**Response**:
```json
{
  "success": true,
  "message": "Payment record created successfully",
  "data": {
    "id": "string",
    "pgId": "string",
    "tenantId": "string",
    "roomId": "string",
    "month": "2024-01",
    "dueDate": "2024-01-05T00:00:00.000Z",
    "rentAmount": 15000,
    "paidAmount": 0,
    "lateFee": 0,
    "status": "PENDING",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

### Update Payment
Updates an existing payment record.

**Endpoint**: `PUT /payments/:id`

**Path Parameters**:
- `id` (string): Payment ID

**Request Body**:
```json
{
  "paidAmount": number,
  "paymentMethod": "string", // "CASH", "UPI", "BANK_TRANSFER", etc.
  "status": "string", // "PENDING", "PAID", "OVERDUE"
  "lateFee": number
}
```

**Response**: Same as create payment response with updated data.

### Delete Payment
Deletes a payment record.

**Endpoint**: `DELETE /payments/:id`

**Path Parameters**:
- `id` (string): Payment ID

**Response**:
```json
{
  "success": true,
  "message": "Payment record deleted successfully"
}
```

---

## 2. Payment Viewing & Listing

### Get PG Payments
Retrieves all payments for a specific PG with pagination.

**Endpoint**: `GET /pg/:pgId/payments`

**Path Parameters**:
- `pgId` (string): PG ID

**Query Parameters**:
- `page` (number, default: 1): Page number
- `limit` (number, default: 10): Items per page
- `sortBy` (string, default: "dueDate"): Sort field
- `sortOrder` (string, default: "DESC"): Sort order (ASC/DESC)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "pgId": "string",
      "tenantId": "string",
      "roomId": "string",
      "month": "2024-01",
      "dueDate": "2024-01-05T00:00:00.000Z",
      "rentAmount": 15000,
      "paidAmount": 15000,
      "status": "PAID",
      "paymentMethod": "UPI",
      "paidDate": "2024-01-03T14:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

### Get Tenant Payments
Retrieves all payments for a specific tenant.

**Endpoint**: `GET /tenant/:tenantId/payments`

**Path Parameters**:
- `tenantId` (string): Tenant ID

**Response**: Array of payment objects (same structure as above, without pagination).

### Get Room Payments
Retrieves all payments for a specific room.

**Endpoint**: `GET /room/:roomId/payments`

**Path Parameters**:
- `roomId` (string): Room ID

**Response**: Array of payment objects.

### Get Payment by ID
Retrieves a specific payment by its ID.

**Endpoint**: `GET /payments/:id`

**Path Parameters**:
- `id` (string): Payment ID

**Response**: Single payment object.

---

## 3. Payment Status Management

### Get Pending Payments
Retrieves all pending payments for a PG.

**Endpoint**: `GET /pg/:pgId/payments/pending`

**Path Parameters**:
- `pgId` (string): PG ID

**Response**: Array of pending payment objects.

### Get Overdue Payments
Retrieves all overdue payments for a PG.

**Endpoint**: `GET /pg/:pgId/payments/overdue`

**Path Parameters**:
- `pgId` (string): PG ID

**Response**: Array of overdue payment objects.

### Get Paid Payments
Retrieves all paid payments for a PG.

**Endpoint**: `GET /pg/:pgId/payments/paid`

**Path Parameters**:
- `pgId` (string): PG ID

**Response**: Array of paid payment objects.

### Mark Payment as Paid
Updates a payment status to paid.

**Endpoint**: `PATCH /payments/:id/mark-paid`

**Path Parameters**:
- `id` (string): Payment ID

**Request Body**:
```json
{
  "paidAmount": number,
  "paymentMethod": "string" // "CASH", "UPI", "BANK_TRANSFER", etc.
}
```

**Response**: Updated payment object.

### Mark Payment as Overdue
Updates a payment status to overdue.

**Endpoint**: `PATCH /payments/:id/mark-overdue`

**Path Parameters**:
- `id` (string): Payment ID

**Request Body**:
```json
{
  "lateFee": number // Optional, default: 0
}
```

**Response**: Updated payment object.

---

## 4. Filtering & Search

### Get Payments by Date Range
Filters payments within a specific date range.

**Endpoint**: `GET /pg/:pgId/payments/date-range`

**Path Parameters**:
- `pgId` (string): PG ID

**Query Parameters**:
- `startDate` (string): Start date (ISO format)
- `endDate` (string): End date (ISO format)

**Response**: Array of filtered payment objects.

### Get Payments by Month
Filters payments by month.

**Endpoint**: `GET /pg/:pgId/payments/month/:month`

**Path Parameters**:
- `pgId` (string): PG ID
- `month` (string): Month in YYYY-MM format

**Response**: Array of payment objects for the specified month.

### Search Payments
Searches payments by tenant ID or room ID.

**Endpoint**: `GET /pg/:pgId/payments/search`

**Path Parameters**:
- `pgId` (string): PG ID

**Query Parameters**:
- `q` (string): Search query

**Response**: Array of matching payment objects.

### Get Payments by Method
Filters payments by payment method.

**Endpoint**: `GET /pg/:pgId/payments/method/:method`

**Path Parameters**:
- `pgId` (string): PG ID
- `method` (string): Payment method (CASH, UPI, BANK_TRANSFER, etc.)

**Response**: Array of payment objects with the specified method.

---

## 5. Analytics & Reporting

### Get Payment Summary
Provides payment summary grouped by status.

**Endpoint**: `GET /pg/:pgId/payments/summary`

**Path Parameters**:
- `pgId` (string): PG ID

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "status": "PAID",
      "totalAmount": 150000,
      "count": 10
    },
    {
      "status": "PENDING",
      "totalAmount": 45000,
      "count": 3
    }
  ]
}
```

### Get Monthly Revenue
Provides monthly revenue report.

**Endpoint**: `GET /pg/:pgId/revenue/monthly`

**Path Parameters**:
- `pgId` (string): PG ID

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "month": "2024-01",
      "totalRevenue": 150000,
      "paymentCount": 10
    },
    {
      "month": "2023-12",
      "totalRevenue": 140000,
      "paymentCount": 9
    }
  ]
}
```

### Get Tenant Payment Performance
Analyzes payment performance by tenant.

**Endpoint**: `GET /pg/:pgId/tenant-payment-performance`

**Path Parameters**:
- `pgId` (string): PG ID

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "tenantId": "tenant_123",
      "status": "PAID",
      "count": 12
    },
    {
      "tenantId": "tenant_123",
      "status": "OVERDUE",
      "count": 1
    }
  ]
}
```

### Get Collection Efficiency
Calculates collection efficiency metrics.

**Endpoint**: `GET /pg/:pgId/collection-efficiency`

**Path Parameters**:
- `pgId` (string): PG ID

**Response**:
```json
{
  "success": true,
  "data": {
    "totalPayments": 100,
    "paidPayments": 85,
    "overduePayments": 10,
    "collectionRate": 85.0,
    "overdueRate": 10.0
  }
}
```

### Get Outstanding Dues
Calculates total outstanding dues.

**Endpoint**: `GET /pg/:pgId/outstanding-dues`

**Path Parameters**:
- `pgId` (string): PG ID

**Response**:
```json
{
  "success": true,
  "data": {
    "totalDues": 75000,
    "totalLateFees": 5000,
    "paymentCount": 5
  }
}
```

### Get Payment Method Analytics
Analyzes payment methods usage.

**Endpoint**: `GET /pg/:pgId/payment-methods/analytics`

**Path Parameters**:
- `pgId` (string): PG ID

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "paymentMethod": "UPI",
      "count": 45,
      "totalAmount": 675000
    },
    {
      "paymentMethod": "CASH",
      "count": 15,
      "totalAmount": 225000
    }
  ]
}
```

---

## 6. Notifications & Reminders

### Get Payment Reminders
Retrieves payments that need reminders (3 days before due date).

**Endpoint**: `GET /pg/:pgId/payment-reminders`

**Path Parameters**:
- `pgId` (string): PG ID

**Response**: Array of payment objects needing reminders.

### Mark Reminder as Sent
Marks a payment reminder as sent.

**Endpoint**: `PATCH /payments/:id/reminder-sent`

**Path Parameters**:
- `id` (string): Payment ID

**Response**:
```json
{
  "success": true,
  "message": "Reminder marked as sent"
}
```

### Get Overdue Notices
Retrieves overdue payments for notices.

**Endpoint**: `GET /pg/:pgId/overdue-notices`

**Path Parameters**:
- `pgId` (string): PG ID

**Response**: Array of overdue payment objects.

---

## 7. Dashboard

### Get Today's Collections
Retrieves today's payment collections.

**Endpoint**: `GET /pg/:pgId/today-collections`

**Path Parameters**:
- `pgId` (string): PG ID

**Response**:
```json
{
  "success": true,
  "data": {
    "totalAmount": 45000,
    "paymentCount": 3
  }
}
```

### Get Week's Collections
Retrieves current week's payment collections.

**Endpoint**: `GET /pg/:pgId/week-collections`

**Path Parameters**:
- `pgId` (string): PG ID

**Response**:
```json
{
  "success": true,
  "data": {
    "totalAmount": 150000,
    "paymentCount": 10
  }
}
```

### Get Monthly Target vs Actual
Compares monthly collection target with actual collections.

**Endpoint**: `GET /pg/:pgId/monthly-target`

**Path Parameters**:
- `pgId` (string): PG ID

**Response**:
```json
{
  "success": true,
  "data": {
    "target": {
      "targetAmount": 200000
    },
    "actual": {
      "actualAmount": 175000
    }
  }
}
```

### Get Recent Activities
Retrieves recent payment activities.

**Endpoint**: `GET /pg/:pgId/recent-activities`

**Path Parameters**:
- `pgId` (string): PG ID

**Response**: Array of recent payment objects (limited to 10).

---

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## Data Models

### Payment Object
```json
{
  "id": "string",
  "pgId": "string",
  "tenantId": "string",
  "roomId": "string",
  "month": "string", // YYYY-MM format
  "dueDate": "string", // ISO date
  "rentAmount": number,
  "paidAmount": number,
  "lateFee": number,
  "status": "string", // "PENDING", "PAID", "OVERDUE"
  "paymentMethod": "string", // "CASH", "UPI", "BANK_TRANSFER", etc.
  "paidDate": "string", // ISO date
  "createdAt": "string", // ISO date
  "updatedAt": "string" // ISO date
}
```

### Payment Status Enum
- `PENDING` - Payment is due but not yet paid
- `PAID` - Payment has been completed
- `OVERDUE` - Payment is past due date

### Payment Method Enum
- `CASH` - Cash payment
- `UPI` - UPI payment
- `BANK_TRANSFER` - Bank transfer
- `CHEQUE` - Cheque payment
- `CARD` - Card payment

---

## Rate Limiting
- 100 requests per minute per API key
- 1000 requests per hour per API key

---

## Pagination
For endpoints that support pagination:
- Default page size: 10
- Maximum page size: 100
- Use `page` and `limit` query parameters

---

## Changelog
- **v1.0.0** - Initial API release with all payment management features
# Tenant Management API Documentation

## Overview
This API provides endpoints for managing tenants in a PG (Paying Guest) accommodation system. All endpoints require a `pgId` parameter to identify the specific PG property.

## Base URL
```
/api/tenants
```

## Authentication
All endpoints require a valid `pgId` parameter to be provided either as a query parameter or in the request body.

## Data Models

### Tenant Model
```typescript
{
  id: UUID (Primary Key, Auto-generated)
  pgId: UUID (Required) - Links to PG property
  name: string (Required)
  contactNumber: string (Required)
  email: string (Optional)
  roomId: UUID (Required) - Foreign key to Room
  roomName: string (Optional) - Name of the room
  bedNumber: integer (Required)
  joiningDate: Date (Required) - Format: YYYY-MM-DD
  rentDueDate: integer (Required) - Day of month (1-31)
  securityDeposit: integer (Optional)
  monthlyRent: integer (Optional)
  status: enum (Required) - Values: 'ACTIVE', 'INACTIVE', 'LEFT'
  emergencyContactName: string (Optional)
  emergencyContactNumber: string (Optional)
  address: string (Optional)
  aadharNumber: string (Optional)
  isActive: boolean (Default: true)
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Endpoints

### 1. Get All Tenants
**GET** `/`

Retrieves all tenants for a specific PG.

#### Parameters
- `pgId` (required): UUID - PG identifier (query parameter or body)

#### Request Example
```http
GET /api/tenants?pgId=123e4567-e89b-12d3-a456-426614174000
```

#### Response
```json
{
  "status": 200,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "pgId": "123e4567-e89b-12d3-a456-426614174000",
      "name": "John Doe",
      "contactNumber": "9876543210",
      "email": "john.doe@example.com",
      "roomId": "660e8400-e29b-41d4-a716-446655440000",
      "roomName": "Room A1",
      "bedNumber": 1,
      "joiningDate": "2024-01-15",
      "rentDueDate": 1,
      "securityDeposit": 5000,
      "monthlyRent": 8000,
      "status": "ACTIVE",
      "emergencyContactName": "Jane Doe",
      "emergencyContactNumber": "9876543211",
      "address": "123 Main St, City",
      "aadharNumber": "1234-5678-9012",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Error Responses
- `400 Bad Request`: Missing or invalid pgId
- `500 Internal Server Error`: Database or server error

---

### 2. Get Tenant by ID
**GET** `/:id`

Retrieves a specific tenant by their ID.

#### Parameters
- `id` (required): UUID - Tenant ID (path parameter)
- `pgId` (required): UUID - PG identifier (query parameter or body)

#### Request Example
```http
GET /api/tenants/550e8400-e29b-41d4-a716-446655440000?pgId=123e4567-e89b-12d3-a456-426614174000
```

#### Response
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "pgId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John Doe",
  "contactNumber": "9876543210",
  "email": "john.doe@example.com",
  "roomId": "660e8400-e29b-41d4-a716-446655440000",
  "roomName": "Room A1",
  "bedNumber": 1,
  "joiningDate": "2024-01-15",
  "rentDueDate": 1,
  "securityDeposit": 5000,
  "monthlyRent": 8000,
  "status": "ACTIVE",
  "emergencyContactName": "Jane Doe",
  "emergencyContactNumber": "9876543211",
  "address": "123 Main St, City",
  "aadharNumber": "1234-5678-9012",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### Error Responses
- `400 Bad Request`: Missing or invalid pgId
- `404 Not Found`: Tenant not found
- `500 Internal Server Error`: Database or server error

---

### 3. Create Tenant
**POST** `/`

Creates a new tenant and updates room occupancy.

#### Request Body
```json
{
  "pgId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John Doe",
  "contactNumber": "9876543210",
  "email": "john.doe@example.com",
  "roomId": "660e8400-e29b-41d4-a716-446655440000",
  "bedNumber": 1,
  "joiningDate": "2024-01-15",
  "rentDueDate": 1,
  "securityDeposit": 5000,
  "monthlyRent": 8000,
  "status": "ACTIVE",
  "emergencyContactName": "Jane Doe",
  "emergencyContactNumber": "9876543211",
  "address": "123 Main St, City",
  "aadharNumber": "1234-5678-9012",
  "isActive": true,
  "roomName": "Room A1"
}
```

#### Required Fields
- `pgId`: UUID
- `name`: string
- `contactNumber`: string
- `roomId`: UUID
- `bedNumber`: integer
- `joiningDate`: Date (YYYY-MM-DD)
- `rentDueDate`: integer (1-31)

#### Response
```json
{
  "status": 201,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "pgId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "contactNumber": "9876543210",
    "email": "john.doe@example.com",
    "roomId": "660e8400-e29b-41d4-a716-446655440000",
    "roomName": "Room A1",
    "bedNumber": 1,
    "joiningDate": "2024-01-15",
    "rentDueDate": 1,
    "securityDeposit": 5000,
    "monthlyRent": 8000,
    "status": "ACTIVE",
    "emergencyContactName": "Jane Doe",
    "emergencyContactNumber": "9876543211",
    "address": "123 Main St, City",
    "aadharNumber": "1234-5678-9012",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Error Responses
- `400 Bad Request`: Missing required fields or no available beds
- `404 Not Found`: Room not found in specified PG
- `500 Internal Server Error`: Database or server error

---

### 4. Update Tenant
**PUT** `/:id`

Updates an existing tenant's information.

#### Parameters
- `id` (required): UUID - Tenant ID (path parameter)
- `pgId` (required): UUID - PG identifier (query parameter or body)

#### Request Body
```json
{
  "pgId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John Smith",
  "contactNumber": "9876543210",
  "email": "john.smith@example.com",
  "roomId": "660e8400-e29b-41d4-a716-446655440000",
  "bedNumber": 2,
  "joiningDate": "2024-01-15",
  "rentDueDate": 5,
  "securityDeposit": 6000,
  "monthlyRent": 8500,
  "status": "ACTIVE",
  "emergencyContactName": "Jane Smith",
  "emergencyContactNumber": "9876543211",
  "address": "456 Oak St, City",
  "aadharNumber": "1234-5678-9012",
  "isActive": true
}
```

#### Response
```json
{
  "message": "Tenant updated successfully",
  "tenant": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "pgId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Smith",
    "contactNumber": "9876543210",
    "email": "john.smith@example.com",
    "roomId": "660e8400-e29b-41d4-a716-446655440000",
    "bedNumber": 2,
    "joiningDate": "2024-01-15",
    "rentDueDate": 5,
    "securityDeposit": 6000,
    "monthlyRent": 8500,
    "status": "ACTIVE",
    "emergencyContactName": "Jane Smith",
    "emergencyContactNumber": "9876543211",
    "address": "456 Oak St, City",
    "aadharNumber": "1234-5678-9012",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T14:45:00.000Z"
  }
}
```

#### Error Responses
- `400 Bad Request`: Missing or invalid pgId
- `404 Not Found`: Tenant not found
- `500 Internal Server Error`: Database or server error

---

### 5. Delete Tenant (Soft Delete)
**DELETE** `/:id`

Performs a soft delete by marking the tenant as inactive and updates room occupancy.

#### Parameters
- `id` (required): UUID - Tenant ID (path parameter)
- `pgId` (required): UUID - PG identifier (query parameter or body)

#### Request Example
```http
DELETE /api/tenants/550e8400-e29b-41d4-a716-446655440000?pgId=123e4567-e89b-12d3-a456-426614174000
```

#### Response
```json
{
  "message": "Tenant marked as inactive and room bed count updated"
}
```

#### Error Responses
- `400 Bad Request`: Missing or invalid pgId
- `404 Not Found`: Tenant not found
- `500 Internal Server Error`: Database or server error

---

## Error Handling

All endpoints return standardized error responses:

### Error Response Format
```json
{
  "error": "Error message",
  "message": "Detailed error description (optional)"
}
```

### Common HTTP Status Codes
- `200 OK`: Successful GET request
- `201 Created`: Successful POST request
- `400 Bad Request`: Invalid request parameters or missing required fields
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server or database error

---

## Notes

1. **Soft Delete**: The delete endpoint performs a soft delete by setting `isActive` to `false` rather than permanently removing the record.

2. **Room Occupancy**: Creating a tenant automatically increments the room's `occupiedBeds` count, and deleting a tenant decrements it.

3. **PG Isolation**: All operations are scoped to a specific PG using the `pgId` parameter, ensuring data isolation between different properties.

4. **Validation**: The API validates room availability before creating tenants and ensures all required fields are provided.

5. **Date Format**: All dates should be provided in ISO format (YYYY-MM-DD) for `joiningDate`.

6. **Status Enum**: The `status` field accepts only 'ACTIVE', 'INACTIVE', or 'LEFT' values.
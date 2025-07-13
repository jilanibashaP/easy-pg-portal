# Room Management API Documentation

## Overview
This API provides endpoints for managing rooms in a PG (Paying Guest) accommodation system. All endpoints require a `pgId` parameter to identify the specific PG property.

## Base URL
```
/api/rooms
```

## Authentication
All endpoints require a valid `pgId` parameter passed either in the request body or as a query parameter.

## Data Models

### Room Model
```typescript
interface RoomAttributes {
  id: string;              // UUID, auto-generated
  pgId: string;            // UUID, required
  name: string;            // Room name/number, required
  type: 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'QUAD';  // Room type, required
  floor?: number;          // Floor number, optional
  totalBeds?: number;      // Total number of beds, optional
  occupiedBeds?: number;   // Currently occupied beds, optional
  monthlyRent?: number;    // Monthly rent amount, optional
  isActive?: boolean;      // Room availability status, optional
  createdAt: Date;         // Auto-generated timestamp
  updatedAt: Date;         // Auto-generated timestamp
}
```

## Endpoints

### 1. Get All Rooms

**GET** `/`

Retrieves all rooms for a specific PG.

#### Parameters
- `pgId` (string, required): PG identifier (can be in body or query)

#### Request Example
```bash
GET /api/rooms?pgId=123e4567-e89b-12d3-a456-426614174000
```

#### Response
```json
{
  "status": 200,
  "data": [
    {
      "id": "room-uuid-1",
      "pgId": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Room A1",
      "type": "DOUBLE",
      "floor": 1,
      "totalBeds": 2,
      "occupiedBeds": 1,
      "monthlyRent": 8000,
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Error Responses
- `400`: pgId is required
- `500`: Failed to fetch rooms

---

### 2. Create Room

**POST** `/`

Creates a new room for a specific PG.

#### Parameters
- `pgId` (string, required): PG identifier
- `name` (string, required): Room name/number
- `type` (enum, required): Room type (SINGLE, DOUBLE, TRIPLE, QUAD)
- `floor` (number, optional): Floor number
- `totalBeds` (number, optional): Total number of beds
- `occupiedBeds` (number, optional): Currently occupied beds
- `monthlyRent` (number, optional): Monthly rent amount
- `isActive` (boolean, optional): Room availability status

#### Request Example
```bash
POST /api/rooms
Content-Type: application/json

{
  "pgId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Room B2",
  "type": "SINGLE",
  "floor": 2,
  "totalBeds": 1,
  "occupiedBeds": 0,
  "monthlyRent": 6000,
  "isActive": true
}
```

#### Response
```json
{
  "status": 201,
  "data": {
    "id": "room-uuid-2",
    "pgId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Room B2",
    "type": "SINGLE",
    "floor": 2,
    "totalBeds": 1,
    "occupiedBeds": 0,
    "monthlyRent": 6000,
    "isActive": true,
    "createdAt": "2024-01-15T11:00:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

#### Error Responses
- `400`: pgId is required
- `500`: Failed to create room

---

### 3. Get Room by ID

**GET** `/:id`

Retrieves a specific room by its ID.

#### Parameters
- `id` (string, required): Room ID (path parameter)
- `pgId` (string, required): PG identifier (body or query)

#### Request Example
```bash
GET /api/rooms/room-uuid-1?pgId=123e4567-e89b-12d3-a456-426614174000
```

#### Response
```json
{
  "status": 200,
  "data": {
    "id": "room-uuid-1",
    "pgId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Room A1",
    "type": "DOUBLE",
    "floor": 1,
    "totalBeds": 2,
    "occupiedBeds": 1,
    "monthlyRent": 8000,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Error Responses
- `400`: pgId is required
- `404`: Room not found
- `500`: Error fetching room

---

### 4. Update Room

**PUT** `/:id`

Updates a specific room's information.

#### Parameters
- `id` (string, required): Room ID (path parameter)
- `pgId` (string, required): PG identifier
- Any room attributes to update (optional)

#### Request Example
```bash
PUT /api/rooms/room-uuid-1
Content-Type: application/json

{
  "pgId": "123e4567-e89b-12d3-a456-426614174000",
  "monthlyRent": 8500,
  "occupiedBeds": 2
}
```

#### Response
```json
{
  "status": 200,
  "data": {
    "id": "room-uuid-1",
    "pgId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Room A1",
    "type": "DOUBLE",
    "floor": 1,
    "totalBeds": 2,
    "occupiedBeds": 2,
    "monthlyRent": 8500,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T12:00:00Z"
  }
}
```

#### Error Responses
- `400`: pgId is required
- `404`: Room not found
- `500`: Failed to update room

---

### 5. Delete Room

**DELETE** `/:id`

Deletes a specific room.

#### Parameters
- `id` (string, required): Room ID (path parameter)
- `pgId` (string, required): PG identifier (body or query)

#### Request Example
```bash
DELETE /api/rooms/room-uuid-1?pgId=123e4567-e89b-12d3-a456-426614174000
```

#### Response
```json
{
  "status": 200,
  "message": "Room deleted"
}
```

#### Error Responses
- `400`: pgId is required
- `404`: Room not found
- `500`: Failed to delete room

---

### 6. Get Tenants by Room Name

**GET** `/roomTenants/:roomName`

Retrieves all active tenants for a specific room identified by its name.

#### Parameters
- `roomName` (string, required): Room name (path parameter, URL encoded)
- `pgId` (string, required): PG identifier (body or query)

#### Request Example
```bash
GET /api/rooms/roomTenants/Room%20A1?pgId=123e4567-e89b-12d3-a456-426614174000
```

#### Response
```json
{
  "status": 200,
  "data": {
    "room": "Room A1",
    "tenants": [
      {
        "id": "tenant-uuid-1",
        "name": "John Doe",
        "roomId": "room-uuid-1",
        "pgId": "123e4567-e89b-12d3-a456-426614174000",
        "isActive": true,
        // ... other tenant fields
      },
      {
        "id": "tenant-uuid-2",
        "name": "Jane Smith",
        "roomId": "room-uuid-1",
        "pgId": "123e4567-e89b-12d3-a456-426614174000",
        "isActive": true,
        // ... other tenant fields
      }
    ]
  }
}
```

#### Error Responses
- `400`: pgId is required
- `404`: Room not found for the given name and PG ID
- `404`: No tenants found for this room
- `500`: Failed to fetch tenants for the room

---

## Error Response Format

All error responses follow this format:
```json
{
  "error": "Error message description",
  "message": "Additional error details (when available)"
}
```

## Common HTTP Status Codes

- `200`: Success
- `201`: Created successfully
- `400`: Bad Request (missing required parameters)
- `404`: Resource not found
- `500`: Internal Server Error

## Notes

1. **pgId Validation**: All endpoints require a valid `pgId` parameter. This ensures data isolation between different PG properties.

2. **Room Name Encoding**: When using room names in URLs (like in the `/roomTenants/:roomName` endpoint), ensure proper URL encoding for special characters and spaces.

3. **Case Sensitivity**: Room names are case-sensitive when searching.

4. **Active Tenants**: The `/roomTenants/:roomName` endpoint only returns active tenants (`isActive: true`).

5. **UUID Format**: All IDs use UUID format for better uniqueness and security.

## Example Usage

### Creating a new room and fetching its tenants:

```bash
# 1. Create a room
curl -X POST http://localhost:3000/api/rooms \
  -H "Content-Type: application/json" \
  -d '{
    "pgId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Room C3",
    "type": "TRIPLE",
    "floor": 3,
    "totalBeds": 3,
    "occupiedBeds": 0,
    "monthlyRent": 7000,
    "isActive": true
  }'

# 2. Get tenants for the room
curl -X GET "http://localhost:3000/api/rooms/roomTenants/Room%20C3?pgId=123e4567-e89b-12d3-a456-426614174000"
```
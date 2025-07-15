# Authentication API Documentation

## Overview
This API provides authentication services for owners including signup, login, and token refresh functionality.

## Base URL
```
https://your-api-domain.com/api/auth
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Access tokens expire in 1 hour by default, and refresh tokens expire in 7 days.

---

## Endpoints

### 1. Owner Signup

**POST** `/signup`

Creates a new owner account.

#### Request Body
```json
{
  "phoneNumber": "string",        // Required
  "password": "string",           // Required
  "firstName": "string",          // Required
  "lastName": "string",           // Required
  "email": "string",              // Required
  "address": "string",            // Optional
  "city": "string",               // Optional
  "state": "string",              // Optional
  "pincode": "string"             // Optional
}
```

#### Request Example
```json
{
  "phoneNumber": "+1234567890",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "pincode": "10001"
}
```

#### Response

**Success (201 Created)**
```json
{
  "message": "Signup successful",
  "data": {
    "id": "uuid",
    "phoneNumber": "+1234567890",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "pincode": "10001",
    "isActive": true,
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
}
```

**Error Responses**

*400 Bad Request - Missing Required Fields*
```json
{
  "message": "Phone number and password are required"
}
```

*400 Bad Request - Owner Already Exists*
```json
{
  "message": "Owner already exists with this phone number"
}
```

*500 Internal Server Error*
```json
{
  "message": "Internal server error"
}
```

---

### 2. Owner Login

**POST** `/login`

Authenticates an owner and returns access and refresh tokens.

#### Request Body
```json
{
  "phone_number": "string",       // Required
  "password": "string"            // Required
}
```

#### Request Example
```json
{
  "phone_number": "+1234567890",
  "password": "securePassword123"
}
```

#### Response

**Success (200 OK)**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "owner": {
    "id": "uuid",
    "phoneNumber": "+1234567890",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "pincode": "10001",
    "isActive": true,
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
}
```

**Error Responses**

*400 Bad Request - Missing Credentials*
```json
{
  "message": "Phone number and password are required"
}
```

*401 Unauthorized - Invalid Credentials*
```json
{
  "message": "Invalid phone number or password"
}
```

*500 Internal Server Error*
```json
{
  "message": "Internal server error"
}
```

---

### 3. Refresh Access Token

**POST** `/refresh`

Generates a new access token using a valid refresh token.

#### Request Body
```json
{
  "refreshToken": "string"        // Required
}
```

#### Request Example
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response

**Success (200 OK)**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses**

*400 Bad Request - Missing Refresh Token*
```json
{
  "message": "Refresh token is required"
}
```

*403 Forbidden - Invalid or Expired Token*
```json
{
  "message": "Invalid or expired refresh token"
}
```

*403 Forbidden - Owner Not Found*
```json
{
  "message": "Owner not found or inactive"
}
```

---

## Authentication Headers

For protected routes, include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Token Information

### Access Token
- **Purpose**: Authenticate API requests
- **Expiry**: 1 hour (configurable via `ACCESS_TOKEN_EXPIRY` environment variable)
- **Payload**: Contains `ownerId`

### Refresh Token
- **Purpose**: Generate new access tokens
- **Expiry**: 7 days (configurable via `REFRESH_TOKEN_EXPIRY` environment variable)
- **Payload**: Contains `ownerId`

## Error Handling

All errors follow a consistent format:

```json
{
  "message": "Error description"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `500` - Internal Server Error

## Security Considerations

1. **Password Hashing**: Passwords are hashed using bcrypt with a salt rounds of 10
2. **JWT Secrets**: Use strong, unique secrets for production environments
3. **Token Expiry**: Access tokens have short expiry times for security
4. **Input Validation**: All required fields are validated before processing
5. **Active Status**: Only active owners can authenticate

## Environment Variables

Required environment variables:

```bash
ACCESS_TOKEN_SECRET=your-strong-access-token-secret
REFRESH_TOKEN_SECRET=your-strong-refresh-token-secret
ACCESS_TOKEN_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=7d
```

## Rate Limiting

Consider implementing rate limiting for authentication endpoints to prevent brute force attacks:

- Login attempts: 5 per minute per IP
- Signup attempts: 3 per minute per IP
- Token refresh: 10 per minute per user

## Example Usage

### JavaScript/Node.js Example

```javascript
// Signup
const signupResponse = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    phoneNumber: '+1234567890',
    password: 'securePassword123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com'
  })
});

// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    phone_number: '+1234567890',
    password: 'securePassword123'
  })
});

const { token, refreshToken, owner } = await loginResponse.json();

// Use token for authenticated requests
const protectedResponse = await fetch('/api/protected-route', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Refresh token when needed
const refreshResponse = await fetch('/api/auth/refresh', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    refreshToken: refreshToken
  })
});
```

### cURL Examples

```bash
# Signup
curl -X POST https://your-api-domain.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1234567890",
    "password": "securePassword123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  }'

# Login
curl -X POST https://your-api-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+1234567890",
    "password": "securePassword123"
  }'

# Refresh Token
curl -X POST https://your-api-domain.com/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your-refresh-token-here"
  }'
```
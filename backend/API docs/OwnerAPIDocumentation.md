# Owner API Documentation

This document describes the available API endpoints for managing Owners in the EasyPG Manager system.

---

## Base URL

```
http://localhost:5000/api/owners
```

---

## Endpoints

### 1. **Create Owner**

**POST** `/`

Creates a new owner.

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "9876543210",
  "address": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001"
  // ... other optional fields
}
```

**Responses:**

* `201 Created` – Owner created successfully
* `400 Bad Request` – Email or phone number already exists
* `500 Internal Server Error` – Server-side issue

---

### 2. **Get All Owners**

**GET** `/`

Fetch all owners with optional filters and pagination.

**Query Parameters:**

* `page` (default: 1)
* `limit` (default: 10)
* `search` – search across name, email, phone, pgId
* `verificationStatus` – filter by verification status
* `isActive` – filter by active status (`true` or `false`)
* `subscriptionPlan` – filter by plan type
* `city`, `state` – location-based filter

**Responses:**

* `200 OK` – Returns list of owners and pagination info
* `500 Internal Server Error` – Server-side issue

---

### 3. **Get Owner by ID**

**GET** `/:id`

Fetch owner details by UUID.

**Path Param:**

* `id` – Owner UUID

**Responses:**

* `200 OK` – Returns owner data
* `404 Not Found` – Owner not found
* `500 Internal Server Error` – Server-side issue

---

### 4. **Get Owner by PG ID**

**GET** `/pg/:pgId`

Fetch owner details by PG ID.

**Path Param:**

* `pgId` – Unique PG identifier

**Responses:**

* `200 OK` – Returns owner data
* `404 Not Found` – Owner not found
* `500 Internal Server Error` – Server-side issue

---

### 5. **Update Owner**

**PUT** `/:id`

Update an existing owner by UUID.

**Path Param:**

* `id` – Owner UUID

**Request Body:**

* Only include fields you wish to update
* `pgId` is immutable and will be ignored if sent

**Responses:**

* `200 OK` – Owner updated successfully
* `400 Bad Request` – Email or phone already in use
* `404 Not Found` – Owner not found
* `500 Internal Server Error` – Server-side issue

---

### 6. **Delete Owner (Soft Delete)**

**DELETE** `/:id`

Soft deletes an owner by setting `isActive` to `false`.

**Path Param:**

* `id` – Owner UUID

**Responses:**

* `200 OK` – Owner deleted successfully
* `404 Not Found` – Owner not found
* `500 Internal Server Error` – Server-side issue

---

## Notes

* Sensitive fields like `aadharNumber`, `panNumber`, and `accountNumber` are excluded in responses for security.
* All responses follow a consistent format:

```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

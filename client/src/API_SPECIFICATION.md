

# RestoManage — Backend API Specification

> This document describes every endpoint the frontend expects. All endpoints return JSON. All authenticated endpoints require a `Bearer` token in the `Authorization` header.

---

## Table of Contents

1. [Data Models](#1-data-models)
2. [Authentication](#2-authentication)
3. [Users / Staff](#3-users--staff)
4. [Dining Tables](#4-dining-tables)
5. [Menu Categories](#5-menu-categories)
6. [Menu Items](#6-menu-items)
7. [Orders](#7-orders)
8. [Order Items](#8-order-items)
9. [Business Logic & Side Effects](#9-business-logic--side-effects)
10. [Role-Based Access Control](#10-role-based-access-control)
11. [Error Format](#11-error-format)

---

## 1. Data Models

### User
```json
{
  "id": "string",
  "fullName": "string",
  "role": "manager" | "waiter" | "kitchen",
  "isActive": true,
  "createdAt": "ISO 8601 string"
}
```

### DiningTable
```json
{
  "id": "string",
  "tableNumber": 1,
  "status": "available" | "occupied",
  "createdAt": "ISO 8601 string"
}
```

### MenuCategory
```json
{
  "id": "string",
  "name": "string"
}
```

### MenuItem
```json
{
  "id": "string",
  "name": "string",
  "categoryId": "string",
  "price": 9.99,
  "imageUrl": "string (full URL)",
  "isAvailable": true,
  "createdAt": "ISO 8601 string"
}
```

### Order
```json
{
  "id": "string",
  "tableId": "string",
  "waiterId": "string",
  "status": "pending" | "preparing" | "ready" | "served" | "cancelled",
  "total": 52.97,
  "createdAt": "ISO 8601 string",
  "updatedAt": "ISO 8601 string",
  "completedAt": "ISO 8601 string | null",
  "items": [OrderItem]
}
```

### OrderItem
```json
{
  "id": "string",
  "orderId": "string",
  "menuItemId": "string",
  "quantity": 2,
  "unitPrice": 9.99,
  "status": "pending" | "cooking" | "ready" | "served",
  "notes": "string | undefined",
  "createdAt": "ISO 8601 string"
}
```

### AuthToken (JWT Payload)
```json
{
  "userId": "string",
  "fullName": "string",
  "role": "manager" | "waiter" | "kitchen",
  "iat": 1700000000,
  "exp": 1700028800
}
```

---

## 2. Authentication

All auth endpoints are **public** (no token required).

### POST `/api/auth/login`

Login with credentials. Returns a JWT token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "u1",
    "fullName": "Sarah Chen",
    "role": "manager",
    "isActive": true,
    "createdAt": "2024-01-15T00:00:00.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid username or password"
}
```

**Frontend usage:** Called from the login page. Token is stored in `localStorage` under key `resto_auth_token`. The `user` object is used to populate the UI immediately.

---

### POST `/api/auth/register`

Register a new manager account. Only creates users with `role: "manager"`.

**Request Body:**
```json
{
  "fullName": "string",
  "username": "string",
  "password": "string"
}
```

**Success Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "u100",
    "fullName": "New Manager",
    "role": "manager",
    "isActive": true,
    "createdAt": "2026-04-06T00:00:00.000Z"
  }
}
```

**Error Response (409):**
```json
{
  "error": "Username already exists"
}
```

**Validation:**
- `fullName`: required, non-empty
- `username`: required, unique
- `password`: required, minimum 6 characters

---

### GET `/api/auth/me`

Get the current authenticated user's profile from the token. Called on app startup to restore session.

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "id": "u1",
  "fullName": "Sarah Chen",
  "role": "manager",
  "isActive": true,
  "createdAt": "2024-01-15T00:00:00.000Z"
}
```

**Error Response (401):**
```json
{
  "error": "Token expired or invalid"
}
```

---

## 3. Users / Staff

All endpoints require authentication. **Manager role only.**

### GET `/api/users`

List all staff members.

**Response (200):**
```json
[
  {
    "id": "u1",
    "fullName": "Sarah Chen",
    "role": "manager",
    "isActive": true,
    "createdAt": "2024-01-15T00:00:00.000Z"
  }
]
```

**Frontend usage:** Manager Dashboard (staff count), Staff Management page (directory table, performance stats).

---

### POST `/api/users`

Create a new staff member.

**Request Body:**
```json
{
  "fullName": "string",
  "role": "waiter" | "kitchen" | "manager",
  "isActive": true
}
```

**Response (201):** Returns the created `User` object with generated `id` and `createdAt`.

---

### PATCH `/api/users/:id`

Update a staff member.

**Request Body (partial):**
```json
{
  "fullName": "string (optional)",
  "role": "waiter | kitchen | manager (optional)",
  "isActive": "boolean (optional)"
}
```

**Response (200):** Returns the updated `User` object.

---

### DELETE `/api/users/:id`

Delete a staff member.

**Response (204):** No content.

---

## 4. Dining Tables

All endpoints require authentication. **Manager role** for write operations; **all roles** can read.

### GET `/api/tables`

List all dining tables.

**Response (200):**
```json
[
  {
    "id": "t1",
    "tableNumber": 1,
    "status": "available",
    "createdAt": "2024-01-15T00:00:00.000Z"
  }
]
```

**Frontend usage:** Manager Dashboard (table grid), Waiter Dashboard (table selector), Table Management page.

---

### POST `/api/tables`

Create a new table. **Manager only.**

**Request Body:**
```json
{
  "tableNumber": 13,
  "status": "available"
}
```

**Validation:** `tableNumber` must be unique.

**Response (201):** Returns the created `DiningTable` object.

---

### PATCH `/api/tables/:id`

Update a table. **Manager only.**

**Request Body (partial):**
```json
{
  "tableNumber": "number (optional)",
  "status": "available | occupied (optional)"
}
```

**Response (200):** Returns the updated `DiningTable` object.

---

### PATCH `/api/tables/:id/status`

Update only the table status. Used by the system when orders are created/completed.

**Request Body:**
```json
{
  "status": "available" | "occupied"
}
```

**Response (200):** Returns the updated `DiningTable` object.

**Note:** This may also be handled as a side effect of order operations (see Business Logic section).

---

### DELETE `/api/tables/:id`

Delete a table. **Manager only.** Should fail if table is currently occupied.

**Response (204):** No content.

**Error (400):**
```json
{
  "error": "Cannot delete an occupied table"
}
```

---

## 5. Menu Categories

All endpoints require authentication. **Manager role** for write; **all roles** can read.

### GET `/api/categories`

List all menu categories.

**Response (200):**
```json
[
  { "id": "c1", "name": "Appetizers" },
  { "id": "c2", "name": "Main Course" }
]
```

**Frontend usage:** Menu Management (tab headers), Order Creation (category tabs).

---

### POST `/api/categories`

Create a new category. **Manager only.**

**Request Body:**
```json
{
  "name": "string"
}
```

**Response (201):** Returns the created `MenuCategory` object.

---

## 6. Menu Items

All endpoints require authentication. **Manager role** for write; **all roles** can read.

### GET `/api/menu-items`

List all menu items. Optionally filter by category.

**Query Parameters:**
- `categoryId` (optional): Filter by category

**Response (200):**
```json
[
  {
    "id": "m1",
    "name": "Bruschetta",
    "categoryId": "c1",
    "price": 9.99,
    "imageUrl": "https://...",
    "isAvailable": true,
    "createdAt": "2024-01-15T00:00:00.000Z"
  }
]
```

**Frontend usage:** Menu Management page, Order Creation page (waiter browsing menu).

---

### POST `/api/menu-items`

Create a new menu item. **Manager only.**

**Request Body:**
```json
{
  "name": "string",
  "categoryId": "string",
  "price": 9.99,
  "imageUrl": "string (full URL)",
  "isAvailable": true
}
```

**Response (201):** Returns the created `MenuItem` object.

---

### PATCH `/api/menu-items/:id`

Update a menu item. **Manager only.**

**Request Body (partial):**
```json
{
  "name": "string (optional)",
  "categoryId": "string (optional)",
  "price": "number (optional)",
  "imageUrl": "string (optional)",
  "isAvailable": "boolean (optional)"
}
```

**Response (200):** Returns the updated `MenuItem` object.

---

### PATCH `/api/menu-items/:id/availability`

Toggle or set availability. **Manager only.**

**Request Body:**
```json
{
  "isAvailable": false
}
```

**Response (200):** Returns the updated `MenuItem` object.

**Frontend usage:** The toggle switch on each menu item card in Menu Management.

---

### DELETE `/api/menu-items/:id`

Delete a menu item. **Manager only.**

**Response (204):** No content.

---

## 7. Orders

All endpoints require authentication. Access varies by role (see RBAC section).

### GET `/api/orders`

List orders. Supports filtering.

**Query Parameters:**
- `status` (optional): `"pending"`, `"preparing"`, `"ready"`, `"served"`, `"cancelled"`
- `waiterId` (optional): Filter by waiter (used by waiter dashboard to show "my orders")
- `tableId` (optional): Filter by table
- `dateFrom` (optional): ISO date string — orders created on or after this date
- `dateTo` (optional): ISO date string — orders created before this date
- `excludeStatus` (optional): Comma-separated statuses to exclude (e.g. `"served,cancelled"` for active orders)

**Response (200):**
```json
[
  {
    "id": "o1",
    "tableId": "t2",
    "waiterId": "u2",
    "status": "preparing",
    "total": 52.97,
    "createdAt": "2026-04-06T10:00:00.000Z",
    "updatedAt": "2026-04-06T10:30:00.000Z",
    "completedAt": null,
    "items": [
      {
        "id": "oi1",
        "orderId": "o1",
        "menuItemId": "m1",
        "quantity": 1,
        "unitPrice": 9.99,
        "status": "ready",
        "createdAt": "2026-04-06T10:00:00.000Z"
      }
    ]
  }
]
```

**Frontend usage:**
- **Manager Dashboard:** All orders with date filtering (today, yesterday, 7 days, 30 days, all)
- **Manager Order Management:** All orders with status + date filtering
- **Waiter Dashboard:** `waiterId=<currentUserId>` to get "my orders"; split into active vs recent
- **Kitchen Dashboard:** `excludeStatus=served,cancelled` to get active orders only

---

### POST `/api/orders`

Create a new order. **Waiter only.**

**Request Body:**
```json
{
  "tableId": "t1",
  "items": [
    {
      "menuItemId": "m1",
      "quantity": 2,
      "unitPrice": 9.99,
      "status": "pending",
      "notes": "No onions (optional)"
    }
  ]
}
```

**Notes:**
- `waiterId` should be inferred from the authenticated user's token on the backend
- `total` should be calculated server-side
- `status` should default to `"pending"`
- The associated table's status should be set to `"occupied"` (see Business Logic)

**Response (201):** Returns the full `Order` object with generated IDs and computed `total`.

---

### PATCH `/api/orders/:id/status`

Update order status. **Manager and Waiter roles.**

**Request Body:**
```json
{
  "status": "served" | "cancelled"
}
```

**Allowed transitions:**
- `pending` → `preparing`, `cancelled`
- `preparing` → `ready`, `cancelled`
- `ready` → `served`, `cancelled`
- `served` → (terminal, no further changes)
- `cancelled` → (terminal, no further changes)

**Side effects:**
- When status becomes `"served"` or `"cancelled"`, set `completedAt` to current timestamp
- When status becomes `"served"` or `"cancelled"`, set the associated table's status to `"available"`

**Response (200):** Returns the updated `Order` object.

**Frontend usage:**
- Manager Order Management: "Mark Served" and "Cancel" buttons
- Waiter Dashboard: "Mark as Served" button on ready orders

---

### POST `/api/orders/:id/items`

Add items to an existing order. **Waiter only.**

**Request Body:**
```json
{
  "items": [
    {
      "menuItemId": "m5",
      "quantity": 1,
      "unitPrice": 34.99,
      "status": "pending",
      "notes": "Medium rare (optional)"
    }
  ]
}
```

**Side effects:**
- Recalculate `total` for the order
- Update `updatedAt`

**Response (200):** Returns the updated `Order` object with all items (old + new).

**Frontend usage:** Waiter Order Creation page — when a table already has an active order, new items are appended.

---

## 8. Order Items

### PATCH `/api/orders/:orderId/items/:itemId/status`

Update the status of a single order item. **Kitchen role.**

**Request Body:**
```json
{
  "status": "cooking" | "ready" | "served"
}
```

**Allowed transitions:**
- `pending` → `cooking`
- `cooking` → `ready`
- `ready` → `served`

**Side effects (computed server-side):**
- If ALL items in the order are `"ready"` or `"served"`, auto-update order status to `"ready"`
- If ANY item transitions to `"cooking"` and order is `"pending"`, auto-update order status to `"preparing"`
- Update order's `updatedAt`

**Response (200):** Returns the updated `Order` object (so the frontend gets the new order status too).

**Frontend usage:** Kitchen Dashboard — "Start Cooking" button (pending → cooking), "Mark Ready" button (cooking → ready).

---

## 9. Business Logic & Side Effects

These are critical behaviors the backend must implement:

### Order → Table Status Sync
| Event | Table Status Change |
|---|---|
| New order created for a table | Table → `"occupied"` |
| Order status → `"served"` | Table → `"available"` |
| Order status → `"cancelled"` | Table → `"available"` |

### Order Status Auto-Transitions (from item status changes)
| Condition | Order Status |
|---|---|
| Any item becomes `"cooking"` and order is `"pending"` | Order → `"preparing"` |
| ALL items are `"ready"` or `"served"` | Order → `"ready"` |

### Order Total Calculation
`total = SUM(item.unitPrice * item.quantity)` for all items in the order. Recalculate whenever items are added.

### Token Expiration
JWT tokens should expire after **8 hours** (`exp` claim).

---

## 10. Role-Based Access Control

Every authenticated endpoint must validate the user's role from the JWT.

| Endpoint | Manager | Waiter | Kitchen |
|---|---|---|---|
| `POST /api/auth/login` | ✅ Public | ✅ Public | ✅ Public |
| `POST /api/auth/register` | ✅ Public | ✅ Public | ✅ Public |
| `GET /api/auth/me` | ✅ | ✅ | ✅ |
| `GET /api/users` | ✅ | ❌ | ❌ |
| `POST /api/users` | ✅ | ❌ | ❌ |
| `PATCH /api/users/:id` | ✅ | ❌ | ❌ |
| `DELETE /api/users/:id` | ✅ | ❌ | ❌ |
| `GET /api/tables` | ✅ | ✅ | ❌ |
| `POST /api/tables` | ✅ | ❌ | ❌ |
| `PATCH /api/tables/:id` | ✅ | ❌ | ❌ |
| `DELETE /api/tables/:id` | ✅ | ❌ | ❌ |
| `GET /api/categories` | ✅ | ✅ | ❌ |
| `POST /api/categories` | ✅ | ❌ | ❌ |
| `GET /api/menu-items` | ✅ | ✅ | ✅ |
| `POST /api/menu-items` | ✅ | ❌ | ❌ |
| `PATCH /api/menu-items/:id` | ✅ | ❌ | ❌ |
| `DELETE /api/menu-items/:id` | ✅ | ❌ | ❌ |
| `GET /api/orders` | ✅ | ✅ | ✅ |
| `POST /api/orders` | ❌ | ✅ | ❌ |
| `PATCH /api/orders/:id/status` | ✅ | ✅ | ❌ |
| `POST /api/orders/:id/items` | ❌ | ✅ | ❌ |
| `PATCH /api/orders/:orderId/items/:itemId/status` | ❌ | ❌ | ✅ |

---

## 11. Error Format

All errors should follow this consistent format:

```json
{
  "error": "Human-readable error message"
}
```

**Standard HTTP status codes used by the frontend:**
- `200` — Success
- `201` — Created
- `204` — No Content (successful delete)
- `400` — Bad Request (validation errors)
- `401` — Unauthorized (missing/invalid/expired token)
- `403` — Forbidden (valid token but wrong role)
- `404` — Not Found
- `409` — Conflict (e.g. duplicate username)
- `500` — Internal Server Error

---

## Frontend Pages → API Mapping

| Page | Role | Endpoints Used |
|---|---|---|
| **Login Page** | Public | `POST /api/auth/login` |
| **Signup Page** | Public | `POST /api/auth/register` |
| **App Init** | All | `GET /api/auth/me` |
| **Manager Dashboard** | Manager | `GET /api/tables`, `GET /api/orders`, `GET /api/users`, `GET /api/menu-items` |
| **Order Management** | Manager | `GET /api/orders`, `PATCH /api/orders/:id/status` |
| **Table Management** | Manager | `GET /api/tables`, `POST /api/tables`, `PATCH /api/tables/:id`, `DELETE /api/tables/:id` |
| **Menu Management** | Manager | `GET /api/categories`, `GET /api/menu-items`, `POST /api/menu-items`, `PATCH /api/menu-items/:id` |
| **Staff Management** | Manager | `GET /api/users`, `POST /api/users`, `PATCH /api/users/:id`, `GET /api/orders` (for performance stats) |
| **Waiter Dashboard** | Waiter | `GET /api/tables`, `GET /api/orders?waiterId=X`, `PATCH /api/orders/:id/status` |
| **Order Creation** | Waiter | `GET /api/tables`, `GET /api/categories`, `GET /api/menu-items`, `GET /api/orders?tableId=X`, `POST /api/orders`, `POST /api/orders/:id/items`, `PATCH /api/orders/:id/status` |
| **Kitchen Dashboard** | Kitchen | `GET /api/orders?excludeStatus=served,cancelled`, `GET /api/tables`, `GET /api/menu-items`, `PATCH /api/orders/:orderId/items/:itemId/status` |


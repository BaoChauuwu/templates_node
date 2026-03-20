# Restaurant Table Reservation System

## Installation & Running

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
PORT=8386
MONGODB_URI=mongodb://127.0.0.1:27017/pe_sdn
JWT_SECRET=11223344
JWT_EXPIRES_IN=1d

# 3. Start server (development)
npm run dev
```

Server runs at: `http://localhost:8386`

---

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login & get JWT token |

### Reservations
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/reservations` | All (authenticated) | Admin: all reservations. Customer: own only |
| POST | `/reservations` | All (authenticated) | Create new reservation |

---

## Postman Testing Guide

### 1. Register
```
POST http://localhost:8386/auth/register
Content-Type: application/json

{
  "username": "user1",
  "password": "123456",
  "role": "customer"
}
```

### 2. Login & Copy Token
```
POST http://localhost:8386/auth/login
Content-Type: application/json

{
  "username": "admin1",
  "password": "123456"
}
```
→ Copy `token` from response.

### 3. Use Token for Protected Routes
In Postman → **Authorization** tab → Type: **Bearer Token** → paste token.

### 4. Create Reservation
```
POST http://localhost:8386/reservations
Authorization: Bearer <token>
Content-Type: application/json

{
  "tableId": "<table ObjectId from MongoDB>",
  "startTime": "2026-05-10T18:00:00.000Z",
  "endTime": "2026-05-10T20:00:00.000Z",
  "note": "Birthday dinner"
}
```

### 5. Get Reservations
```
GET http://localhost:8386/reservations
Authorization: Bearer <token>
```
- Admin → returns all reservations
- Customer → returns only their own

---

## Sample Test Accounts

| Role | Username | Password | Description |
|------|----------|----------|-------------|
| Admin | admin1 | 123456 | Can view all reservations |
| Customer | user1 | 123456 | Can create & view own reservations |

> Register these accounts via `POST /auth/register` before testing.

---

## Project Structure

```
/src
  /models
    userModel.js
    tableModel.js
    reservationModel.js
  /controllers
    authController.js
    reservationController.js
  /routes
    authRoutes.js
    reservationsRoutes.js
  /services
    authService.js
    reservationsService.js
  /middlewares
    authMiddleware.js
index.js
.env
package.json
```

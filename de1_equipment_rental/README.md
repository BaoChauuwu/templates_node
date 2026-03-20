# Equipment Rental Management System

A Node.js/Mongoose-based equipment rental system with Role-Based Access Control (RBAC).

## Installation

1. Clone or download the project.
2. Initialize project:
   ```bash
   npm install
   ```
3. Set up `.env` file with the following variables:
   ```
   PORT=8386
   MONGODB_URI=mongodb://127.0.0.1:27017/equipment_rental
   JWT_SECRET=your_secret_key
   JWT_EXPIRES_IN=1d
   ```
4. Run the application:
   ```bash
   npm run dev
   ```

## Sample Test Accounts

| Role     | Username | Password | Description                                  |
| -------- | -------- | -------- | -------------------------------------------- |
| Admin    | admin1   | 123456   | Can manage users, equipment, and rentals    |
| Customer | user1    | 123456   | Can view equipment and create rental orders |

## Postman Testing Guide

### 1. Authentication
- **Register**: `POST /auth/register` (Body: `username`, `password`)
- **Login**: `POST /auth/login` (Body: `username`, `password`) -> Returns `token`.

### 2. User Management (Admin Only)
- **Get All Users**: `GET /users` (Header: `Authorization: Bearer <token>`)
- **Delete User**: `DELETE /users/:id` (Header: `Authorization: Bearer <token>`) - *Checks for active rentals*.

### 3. Equipment Management
- **Create Equipment**: `POST /equipment` (Admin Only)
- **Get All Equipment**: `GET /equipment` (All)

### 4. Rental Management
- **Create Rental**: `POST /rentals` (Customer/Admin)
  - Input: `equipmentId`, `startDate`, `endDate`, `quantity`
- **GetAll Rentals**: `GET /rentals`
  - Admin: view all.
  - Customer: view their own.
- **Return Equipment**: `PATCH /rentals/:id/return` (Admin)
  - Calculates late penalty (10% * pricePerDay * late_days * quantity).
  - Restores stock quantity.
- **Search Rentals by Date Range**: `GET /rentalsByDate?start=YYYY-MM-DD&end=YYYY-MM-DD`
  - Admin: search all.
  - Customer: search within their own rentals.

## Project Structure
- `/src/models`: Mongoose schemas.
- `/src/controllers`: Business logic.
- `/src/routes`: API endpoints and middleware application.
- `index.js`: Main entry point.

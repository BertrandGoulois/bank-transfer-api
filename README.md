# Bank API Node.js

This API implements a banking system in Node.js exposing REST endpoints. The project is built with **TypeScript**, follows **Test Driven Development (TDD)**, and uses **Sequelize** for database interaction. **SQLite** is used for testing, **PostgreSQL** for production.

The architecture is modular, separating domain logic, use-cases, repositories, infrastructure, and interface layers. All tests pass, and the project demonstrates maintainable, type-safe, and secure transaction handling.

---

## Technical Stack

* **Node.js**
* **Express**
* **PostgreSQL** (production)
* **SQLite** (testing)
* **Sequelize**
* **Jest** (unit testing)
* **bcrypt** (password hashing)
* **jsonwebtoken** (JWT authentication)
* **TypeScript**
* **Zod** (input validation)

---

## Installation & Configuration

1. Clone the project:

```bash
git clone <repository-url>
cd bank-transfer-api
npm install
```

2. Create a `.env` file with your database credentials and JWT secret:

```
DB_HOST=******
DB_PORT=******
DB_NAME=******
DB_USER=******
DB_PASSWORD=******
NODE_ENV=******
JWT_SECRET=******
```

> Tests automatically use SQLite in the `test` environment. No seeding is required.

3. Compile TypeScript:

```bash
npx tsc
```

4. Run migrations to generate database tables:

```bash
npx sequelize-cli db:migrate
```

5. (Optional) Load development data using SQL scripts:

```bash
psql -h localhost -U <DB_USER> -d <DB_NAME> -f scripts/sql/seed-dev-data.sql
```

---

## Running

* **Development mode**:

```bash
npm run dev
```

* **Production**:

```bash
npm start
```

* **Unit tests**:

```bash
npm test
```

---

## Endpoints

### Accounts

#### Get account by ID

* **GET** `/accounts/:id`
* **Response JSON**:

```json
{
  "id": 1,
  "balance": 1000,
  "ownerId": 1,
  "createdAt": "2025-10-15T00:00:00.000Z",
  "updatedAt": "2025-10-15T00:00:00.000Z"
}
```

* **Errors**:

  * `400` → invalid accountId
  * `404` → account not found

#### Deposit

* **POST** `/accounts/:id/deposit`
* **Body JSON**:

```json
{
  "accountId": 1,
  "amount": 50
}
```

* **Errors**:

  * `400` → invalid accountId or amount
  * `400` → other deposit errors

#### Withdraw

* **POST** `/accounts/:id/withdraw`
* **Body JSON**:

```json
{
  "accountId": 1,
  "amount": 20
}
```

* **Errors**:

  * `400` → invalid accountId or amount
  * `400` → insufficient funds

#### Transfer

* **POST** `/accounts/transfer`
* **Body JSON**:

```json
{
  "fromId": 1,
  "toId": 2,
  "amount": 50
}
```

* **Errors**:

  * `400` → invalid fields
  * `400` → insufficient funds
  * `404` → sender or receiver not found

---

### Transactions

#### Get transaction by ID

* **GET** `/transactions/:id`
* **Response JSON**:

```json
{
  "id": 1,
  "accountId": 1,
  "type": "credit",
  "amount": 200,
  "description": "Salary",
  "createdAt": "2025-10-15T00:00:00.000Z"
}
```

* **Errors**:

  * `400` → invalid ID
  * `404` → transaction not found

#### Get all transactions by account

* **GET** `/transactions/account/:accountId`
* **Response JSON**:

```json
[
  {
    "id": 1,
    "accountId": 1,
    "type": "debit",
    "amount": 50,
    "description": "Transfer",
    "createdAt": "2025-10-15T00:00:00.000Z"
  }
]
```

* **Errors**:

  * `400` → invalid accountId
  * `500` → failed to fetch transactions

#### Get transaction statistics by account

* **GET** `/transactions/stats/:accountId`
* **Response JSON**:

```json
{
  "total": 1000,
  "count": 5,
  "average": 200,
  "byType": { "credit": 3, "debit": 2 }
}
```

* **Errors**:

  * `400` → invalid accountId
  * `500` → failed to fetch stats

---

### Users

#### Get user by ID

* **GET** `/users/id/:id`
* **Errors**:

  * `400` → invalid id
  * `404` → user not found

#### Get user by email

* **GET** `/users/email/:email`
* **Errors**:

  * `400` → invalid email
  * `404` → user not found

#### List all users

* **GET** `/users`
* **Response JSON**: list of users

---

### Authentication

#### Login

* **POST** `/auth/login`
* **Body JSON**:

```json
{
  "email": "user@mail.com",
  "password": "password123"
}
```

* **Response JSON**:

```json
{
  "token": "<JWT token>"
}
```

* **Errors**:

  * `400` → invalid fields
  * `401` → authentication failed

* **Usage**: include JWT in `Authorization` header for protected endpoints:

```
Authorization: Bearer <JWT token>
```

---

## Key Features

* Full account operations: deposit, withdrawal, transfer
* Transaction history and statistics
* Input validation with Zod
* JWT authentication and hashed passwords
* TDD with Jest for success and failure cases
* SQLite for fast test runs
* Sequelize transactions and rollback handling
* Type-safe TypeScript throughout
* Modular, clean architecture separating domain, application, infrastructure, and interface

---

## Changelog / Release

**v1.5.1** – Current

* Modular architecture with domain, application, infrastructure, and interface layers
* Removed seeding
* All endpoints fully typed and validated
* All tests passing on SQLite
* Controllers and use-cases refactored for maintainability
* Updated README with current endpoints and instructions

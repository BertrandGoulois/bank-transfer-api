# Bank API Node.js

This API demonstrates the design of a banking application in Node.js exposing REST endpoints. The project follows **Test Driven Development (TDD)** and uses **Sequelize**, **Express**, **Jest**, **SQLite** for testing, and **PostgreSQL** for production.

All commits are descriptive to trace development, allowing clear visibility of new features, tests, and fixes. The project demonstrates structured, maintainable, and secure handling of financial transactions.

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

---

## Installation & Configuration

1. Clone the project:

```bash
git clone <repository-url>
cd bank-transfer-api
npm install
```

2. Create a `.env` file at the root with your database parameters and JWT secret:

```
DB_HOST=******
DB_PORT=******
DB_NAME=******
DB_USER=******
DB_PASSWORD=******
NODE_ENV=******
JWT_SECRET=******
```

> In the `test` environment, the SQLite database is used automatically for isolated testing.

3. Seed the database with sample data:

```bash
npm run seed
```

---

## Running

* **Development mode**:

```bash
npm run dev
```

* **Unit tests**:

```bash
npm test
```

---

## Endpoints

### 1. Money Transfer

* **POST** : `/accounts/:fromAccountId/transfer`
* **Body JSON** :

```json
{
    "toAccountId": 2,
    "amount": 50
}
```

* **Error cases**:

  * `404` → "Sender account not found" / "Receiver account not found"
  * `400` → "Insufficient balance" / "Sender and receiver must be different"
  * `400` → "Missing required fields" / "Amount must be a positive number"

---

### 2. Withdrawal

* **POST** : `/accounts/:accountId/withdraw`
* **Body JSON** :

```json
{
    "amount": 10
}
```

* **Error cases**:

  * `404` → "Account not found"
  * `400` → "Insufficient balance" / "Amount must be a positive number"

---

### 3. Transaction History

* **GET** : `/accounts/:accountId/history`
* **Response JSON** :

```json
{
    "transactions": [
        {
            "id": 1,
            "accountId": 1,
            "type": "credit",
            "amount": 200,
            "description": "Salary",
            "createdAt": "2025-10-15T00:00:00.000Z",
            "updatedAt": "2025-10-15T00:00:00.000Z"
        }
    ],
    "metrics": {
        "averageAmount": 75,
        "byType": { "credit": 2, "debit": 1 },
        "byDay": { "2025-10-19": 3 }
    }
}
```

* **Error cases**:

  * `404` → "Account not found"
  * `400` → "Invalid account id"

---

### 4. Authentication

* **POST** : `/auth/login`
* **Body JSON** :

```json
{
    "email": "bertrand@mail.com",
    "password": "userpassword"
}
```

* **Response JSON** :

```json
{
    "token": "<JWT token>"
}
```

* **Error cases**:

  * `401` → "Invalid credentials"
  * `400` → "Missing required fields"

* **Usage**: Include the token in the `Authorization` header for protected endpoints:

```
Authorization: Bearer <JWT token>
```

---

## Key Features

* Full transaction handling: transfer and withdrawal
* History endpoint with summary metrics (average amount, count per type, count per day)
* Transaction safety using Sequelize transactions and locks, rollback on failure
* JWT-based authentication with hashed passwords
* TDD approach with Jest covering all success and error cases
* Seed data for rapid database initialization
* Type-safe Sequelize queries with cross-dialect support
* English messages for API consistency
* Migrated fully to TypeScript
* Improved service and controller structure for maintainability

---

## Objective

This project demonstrates:

* Designing tested and secure REST endpoints
* Mastery of Sequelize for transactional operations
* TDD-driven, reliable, and maintainable Node.js code
* Implementation of JWT-based authentication
* Migration from JavaScript to TypeScript for type safety

---

## Changelog / Release

**v1.0.0**

**Description:**
This release delivers a complete Node.js banking API with REST endpoints, developed using **Test Driven Development (TDD)**. It demonstrates structured transaction handling, database interaction with PostgreSQL via Sequelize, and secure transaction management.

**Features included:**

* **Accounts management** – checking accounts, deposits, withdrawals, transfers.
* **Transaction history** – retrieve all transactions with synthetic metrics (average amount, count per type, count per day).
* **Error handling** – proper HTTP codes for missing accounts, insufficient funds, and invalid operations.
* **TDD coverage** – Jest unit tests for normal and edge cases.
* **Seed data** – allows initializing the database for development.

**Notes:**

* Database configuration is currently via `config.json`.
* Commits illustrate the step-by-step development process.
* Ready for local development via `npm run dev` or unit testing via `npm start test`.

**v1.1.0**

* Replaced `config/config.json` with environment-based `.env` and dynamic `config.js`.
* Updated Sequelize initialization to read DB credentials from `.env`.
* Tests now automatically use `test` database in test environment.
* Improved stability of unit tests by enforcing environment-specific DB selection.

**v1.2.0**

* Introduced middleware input validation for all endpoints (transfer, withdrawal, history)
* All API messages standardized in English
* Controllers and services split into separate files per endpoint
* Unit tests updated to cover middleware and service errors (19/19 passing)
* Added JSDoc comments to all service and controller functions for documentation and maintainability
* Transactional safety ensured with `FOR UPDATE` and rollback handling

**v1.3.0**

* Added JWT-based authentication for users
* Passwords are now hashed using bcrypt
* New `/auth/login` endpoint
* Updated middleware and unit tests to handle authentication
* Updated README with login instructions and token usage
* All tests passing (including authentication)

**v1.4.0**

* Migrated codebase and tests from JavaScript to TypeScript
* Removed all JSDoc comments
* All previous functionality preserved and tests passing
* Project ready for TypeScript development

**v1.4.1**

* Refactored services and controllers for cleaner TypeScript usage
* Updated Sequelize queries with proper generics and type safety
* Removed redundant array destructuring when fetching single rows
* Improved error handling consistency across controllers
* No breaking API changes; tests fully passing

**v1.5.0**

* Tests now run on SQLite for faster, isolated test environment
* All services refactored to use Sequelize model methods instead of raw SQL
* Transaction handling and locks standardized via Sequelize
* Improved cross-dialect compatibility and type safety
* No breaking API changes; all tests passing

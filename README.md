# Bank API Node.js

This API demonstrates the design of a banking application in Node.js exposing REST endpoints. The project follows **Test Driven Development (TDD)** and uses **Sequelize**, **Express**, **Jest**, and **PostgreSQL**.

All commits are descriptive to trace development, allowing clear visibility of new features, tests, and fixes. The project demonstrates structured, maintainable, and secure handling of financial transactions.

---

## Technical Stack

* **Node.js**
* **Express**
* **PostgreSQL**
* **Sequelize**
* **Jest** (unit testing)
* **bcrypt** (password hashing)
* **jsonwebtoken** (JWT authentication)

---

## Installation & Configuration

1. Clone the project:

```bash
git clone <repository-url>
cd bank-transfer-api
npm install
```

2. Create a `.env` file at the root with your PostgreSQL parameters and JWT secret:

```
DB_HOST=******
DB_PORT=******
DB_NAME=******
DB_NAME_TEST=******
DB_USER=******
DB_PASSWORD=******
NODE_ENV=******
JWT_SECRET=******
```

> In the `test` environment, the database `bankdbtest` will be used automatically.

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

* **POST** : `http://localhost:3000/accounts/:fromAccountId/transfer`
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

* **POST** : `http://localhost:3000/accounts/:accountId/withdraw`
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

* **GET** : `http://localhost:3000/accounts/:accountId/history`
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

* **POST** : `http://localhost:3000/auth/login`
* **Body JSON**:

```json
{
    "email": "bertrand@mail.com",
    "password": "userpassword"
}
```

* **Response JSON**:

```json
{
    "token": "<JWT token>"
}
```

* **Error cases**:

  * `401` → "Invalid email or password"
  * `400` → "Missing required fields"

* **Usage**: Include the token in the `Authorization` header for protected endpoints:

```
Authorization: Bearer <JWT token>
```

---

## Key Features

* Full transaction handling: transfer and withdrawal
* History endpoint with summary metrics (average amount, count per type, count per day)
* Transaction safety with `FOR UPDATE` and rollback on failure
* JWT-based authentication with hashed passwords
* TDD approach with Jest covering all success and error cases
* Seed data for rapid database initialization
* English messages for API consistency
* JSDoc comments for services and controllers for easier maintenance

---

## JSDoc

All service and controller functions are documented with JSDoc for easier IDE integration and maintenance.

---

## Objective

This project demonstrates:

* Ability to design tested and secure REST endpoints
* Mastery of Sequelize for transactional operations
* TDD-driven, reliable, and maintainable Node.js code
* Implementation of JWT-based authentication

---

## Changelog / Release v1.3.0

* Added JWT-based authentication
* Passwords are now hashed
* Added `/auth/login` endpoint
* Updated middleware and endpoint tests for authentication
* Updated README with login instructions and token usage
* All previous tests passing with authentication applied

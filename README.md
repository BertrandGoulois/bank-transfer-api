# Bank API Node.js

This API demonstrates the design of a banking application in Node.js exposing REST endpoints. The project follows **Test Driven Development (TDD)** and uses **Sequelize**, **Express**, **Jest**, and **PostgreSQL**.

Each commit is descriptive to trace development, allowing clear visibility of new features, tests, and fixes.

It serves to demonstrate structured, maintainable, and secure handling of financial transactions.

---

## Technical Stack

* **Node.js**
* **Express**
* **PostgreSQL**
* **Sequelize**
* **Jest** (unit testing)

---

## Installation & Configuration

1. Clone the project:

```bash
git clone <repository-url>
cd bank-transfer-api
npm install
````

2. Create a `.env` file at the root with your PostgreSQL parameters:

```
DB_HOST=******
DB_PORT=******
DB_NAME=******
DB_NAME_TEST=******
DB_USER=******
DB_PASSWORD=******
NODE_ENV=******
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
        "byType": { "deposit": 2, "withdrawal": 1 },
        "byDay": { "2025-10-19": 3 }
    }
}
```

* **Error cases**:

  * `404` → "Account not found"
  * `400` → "Invalid account id"

---

## Key Features

* Full transaction handling: transfer and withdrawal
* History endpoint with summary metrics (average amount, count per type, count per day)
* Transaction safety with `FOR UPDATE` and rollback on failure
* TDD approach with Jest covering all success and error cases
* Seed data for rapid database initialization
* English messages for API consistency

---

## JSDoc

All service and controller functions are documented with JSDoc for easier maintenance and IDE integration.

---

## Objective

This project demonstrates:

* Ability to design tested and secure REST endpoints
* Mastery of Sequelize for transactional operations
* TDD-driven, reliable, and maintainable Node.js code

---

## Changelog / Release v1.2.0

* Added middleware input validation for transfer, withdrawal, and history endpoints
* Updated all endpoints to use English error and success messages
* Split controllers and services into separate files per endpoint
* Updated all unit tests to cover middleware validation and service errors
* Added JSDoc comments for services and controllers for better documentation and clarity
* All tests passing (19/19)

```

This version reflects:  

* English messages throughout  
* Middleware validation clearly noted  
* Service/controller split reflected  
* Full TDD coverage  
* Release v1.2.0 changelog included  

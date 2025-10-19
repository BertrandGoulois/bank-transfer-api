# API Bancaire Node.js

Cette API démontre, via l'historique des commits, la réalisation d'une application bancaire en Node.js avec des endpoints REST. Le projet suit la méthodologie **Test Driven Development (TDD)** et utilise **Sequelize**, **Express**, **Jest**, et **PostgreSQL**.

---

## Stack technique

* **Node.js**
* **Express**
* **PostgreSQL**
* **Sequelize**
* **Jest** (tests unitaires)

---

## Installation

```bash
git clone <repository-url>
cd bank-transfer-api
npm install
```

### Lancement

* **Mode développement** :

```bash
npm start dev
```

* **Tests unitaires** :

```bash
npm start test
```

---

## Endpoints

### 1. Transfert d'argent

* **POST** : `http://localhost:3000/accounts/:fromAccountId/transfer`
* **Body JSON** :

```json
{
    "toAccountId": 2,
    "amount": 50
}
```

* **Cas d'erreurs** :

  * Compte source introuvable → `404`
  * Compte destination introuvable → `404`
  * Solde insuffisant → `400`

---

### 2. Retrait

* **POST** : `http://localhost:3000/accounts/:accountId/withdraw`
* **Body JSON** :

```json
{
    "amount": 10
}
```

* **Cas d'erreurs** :

  * Compte introuvable → `404`
  * Solde insuffisant → `400`

---

### 3. Historique des transactions

* **GET** : `http://localhost:3000/accounts/:accountId/history`
* **Réponse JSON** :

```json
{
    "transactions": [
        {
            "id": 1,
            "type": "deposit",
            "amount": 100,
            "description": "Initial deposit",
            "createdAt": "2025-10-19T12:00:00Z"
        }
    ],
    "metrics": {
        "averageAmount": 75,
        "byType": {
            "deposit": 2,
            "withdrawal": 1
        },
        "byDay": {
            "2025-10-19": 3
        }
    }
}
```

* **Cas d'erreurs** :

  * Compte introuvable → `404`

---

## Fonctionnalités

* Gestion complète des transactions : transfert et retrait
* Historique des transactions avec statistiques synthétiques :

  * Montant moyen
  * Nombre par type (deposit/withdrawal)
  * Nombre par jour
* Suivi TDD avec Jest
* Sécurité des transactions via `FOR UPDATE` et rollback en cas d’erreur

---

## Notes

* Les transactions sont sauvegardées dans PostgreSQL avec Sequelize.
* Les erreurs retournent un JSON standard `{ error: "message" }` avec le code HTTP correspondant.
* Les tests unitaires valident à la fois les cas normaux et les erreurs.
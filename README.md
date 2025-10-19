# API Bancaire Node.js

Cette API illustre la conception d’une application bancaire en Node.js exposant des endpoints REST. Le projet suit la méthodologie **Test Driven Development (TDD)** et utilise **Sequelize**, **Express**, **Jest** et **PostgreSQL**.

Chaque commit a été pensé pour tracer ma démarche de développement, tant par son intitulé clair que par le contenu détaillé, permettant de suivre l’évolution des fonctionnalités, des tests et des corrections.

Elle sert à démontrer ma capacité à concevoir, tester et sécuriser des transactions financières de manière structurée et maintenable.

---

## Stack technique

* **Node.js**
* **Express**
* **PostgreSQL**
* **Sequelize**
* **Jest** (tests unitaires)

---

## Installation & Configuration

1. Cloner le projet :

```bash
git clone <repository-url>
cd bank-transfer-api
npm install
```

2. Adapter `config/config.json` avec vos paramètres PostgreSQL (`user`, `password`, `host`, `port`, `database`) pour chaque environnement (`development`, `test`, `production`).

3. Peupler la base avec des données d’exemple :

```bash
npm run seed
```

---

## Lancement

* **Mode développement** :

```bash
npm start dev
```

* **Tests unitaires** :

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

* **Cas d'erreurs** : compte source ou destination introuvable (`404`), solde insuffisant (`400`).

---

### 2. Retrait

* **POST** : `http://localhost:3000/accounts/:accountId/withdraw`
* **Body JSON** :

```json
{
    "amount": 10
}
```

* **Cas d'erreurs** : compte introuvable (`404`), solde insuffisant (`400`).

---

### 3. Historique des transactions

* **GET** : `http://localhost:3000/accounts/:accountId/history`
* **Réponse JSON** :

```json
{
    "transactions": [ ... ],
    "metrics": {
        "averageAmount": 75,
        "byType": { "deposit": 2, "withdrawal": 1 },
        "byDay": { "2025-10-19": 3 }
    }
}
```

* **Cas d'erreurs** : compte introuvable (`404`).

---

## Fonctionnalités clés

* Gestion complète des transactions : transfert et retrait
* Historique avec statistiques synthétiques (montant moyen, nombre par type et par jour)
* Sécurité transactionnelle via `FOR UPDATE` et rollback en cas d’erreur
* Suivi TDD avec Jest pour validation complète des cas normaux et erreurs
* Utilisation de seeds pour initialiser rapidement la base de données

---

## Objectif démonstratif

Ce projet est un support pour montrer :

* Ma capacité à concevoir des endpoints REST sécurisés et testés
* Ma maîtrise de Sequelize pour la gestion transactionnelle
* Mon approche TDD pour produire un code fiable et maintenable
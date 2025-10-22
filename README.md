# API Bancaire Node.js

Cette API illustre la conception d’une application bancaire en Node.js exposant des endpoints REST. Le projet suit la méthodologie **Test Driven Development (TDD)** et utilise **Sequelize**, **Express**, **Jest** et **PostgreSQL**.

Chaque commit a été pensé pour tracer la démarche de développement, tant par son intitulé clair que par le contenu détaillé, permettant de suivre l’évolution des fonctionnalités, des tests et des corrections.

Elle sert à démontrer la capacité à concevoir, tester et sécuriser des transactions financières de manière structurée et maintenable.

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

2. Créer un fichier `.env` à la racine avec vos paramètres PostgreSQL :

```
DB_HOST=******
DB_PORT=******
DB_NAME=******
DB_NAME_TEST=******
DB_USER=******
DB_PASSWORD=******
NODE_ENV=******
```

> En environnement `test`, la base `bankdbtest` sera automatiquement utilisée.

3. Peupler la base avec des données d’exemple :

```bash
npm run seed
```

---

## Lancement

* **Mode développement** :

```bash
npm run dev
```

* **Tests unitaires** :

```bash
npm test
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

* Capacité à concevoir des endpoints REST sécurisés et testés
* Maîtrise de Sequelize pour la gestion transactionnelle
* Approche TDD pour produire un code fiable et maintenable

---

## Changelog / Release v1.1.0

* Migration de la configuration de `config.json` vers `.env` et `config.js`
* Initialisation de Sequelize via `.env`
* Tests unitaires utilisent désormais automatiquement `bankdbtest` en environnement `test`
* Amélioration de la stabilité des tests unitaires par sélection automatique de la base selon l’environnement
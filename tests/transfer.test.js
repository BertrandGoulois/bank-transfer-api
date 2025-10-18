const request = require('supertest');
const app = require('../server');
const { sequelize } = require('../models');

let fromAccountId, toAccountId;

beforeAll(async () => {
  // Insert users
  const [user1] = await sequelize.query(
    `INSERT INTO "Users" (name, email, "createdAt","updatedAt") 
     VALUES ('Bertrand','bertrand@mail.com',NOW(),NOW()) RETURNING id`,
    { type: sequelize.QueryTypes.INSERT }
  );
  const [user2] = await sequelize.query(
    `INSERT INTO "Users" (name, email, "createdAt","updatedAt") 
     VALUES ('Jean','jean@mail.com',NOW(),NOW()) RETURNING id`,
    { type: sequelize.QueryTypes.INSERT }
  );

  // Insert accounts
  const [account1] = await sequelize.query(
    `INSERT INTO "Accounts" ("userId","type","balance","createdAt","updatedAt") 
     VALUES (:userId,'checking',500,NOW(),NOW()) RETURNING id`,
    { replacements: { userId: user1[0].id }, type: sequelize.QueryTypes.INSERT }
  );
  const [account2] = await sequelize.query(
    `INSERT INTO "Accounts" ("userId","type","balance","createdAt","updatedAt") 
     VALUES (:userId,'checking',300,NOW(),NOW()) RETURNING id`,
    { replacements: { userId: user2[0].id }, type: sequelize.QueryTypes.INSERT }
  );

  fromAccountId = account1[0].id;
  toAccountId = account2[0].id;
});

describe('Transfer endpoint', () => {
  test('should fail if accounts are the same', async () => {
    const res = await request(app)
      .post(`/accounts/${fromAccountId}/transfer`)
      .send({ toAccountId: fromAccountId, amount: 50 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Les deux comptes ne peuvent être identiques');
  });

  test('should fail if source account does not exist', async () => {
    const res = await request(app)
      .post('/accounts/9999/transfer')
      .send({ toAccountId: toAccountId, amount: 50 });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Compte source introuvable');
  });

  test('should fail if destination account does not exist', async () => {
    const res = await request(app)
      .post(`/accounts/${fromAccountId}/transfer`)
      .send({ toAccountId: 9999, amount: 50 });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Compte destination introuvable');
  });

  test('should fail if source has insufficient balance', async () => {
    const res = await request(app)
      .post(`/accounts/${fromAccountId}/transfer`)
      .send({ toAccountId, amount: 9999 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Solde insuffisant');
  });

  test('should succeed and update balances', async () => {
    const amount = 50;

    const beforeFrom = await sequelize.query(
      `SELECT balance FROM "Accounts" WHERE id = :id`,
      { replacements: { id: fromAccountId }, type: sequelize.QueryTypes.SELECT }
    );
    const beforeTo = await sequelize.query(
      `SELECT balance FROM "Accounts" WHERE id = :id`,
      { replacements: { id: toAccountId }, type: sequelize.QueryTypes.SELECT }
    );

    const res = await request(app)
      .post(`/accounts/${fromAccountId}/transfer`)
      .send({ toAccountId, amount });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Transfert réussi');

    const afterFrom = await sequelize.query(
      `SELECT balance FROM "Accounts" WHERE id = :id`,
      { replacements: { id: fromAccountId }, type: sequelize.QueryTypes.SELECT }
    );
    const afterTo = await sequelize.query(
      `SELECT balance FROM "Accounts" WHERE id = :id`,
      { replacements: { id: toAccountId }, type: sequelize.QueryTypes.SELECT }
    );

    expect(parseFloat(afterFrom[0].balance)).toBe(parseFloat(beforeFrom[0].balance) - amount);
    expect(parseFloat(afterTo[0].balance)).toBe(parseFloat(beforeTo[0].balance) + amount);
  });

});

const request = require('supertest');
const app = require('../server');
const { sequelize, User, Account } = require('../models');

let fromAccountId, toAccountId;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const user1 = await User.create({ name: 'Bertrand', email: 'bertrand@mail.com' });
  const user2 = await User.create({ name: 'Jean', email: 'jean@mail.com' });

  const account1 = await Account.create({ userId: user1.id, type: 'checking', balance: 500 });
  const account2 = await Account.create({ userId: user2.id, type: 'checking', balance: 300 });

  fromAccountId = account1.id;
  toAccountId = account2.id;
});

describe('Transfer endpoint', () => {
  test('should fail if source account id not a number', async () => {
    const res = await request(app)
      .post(`/accounts/notANumber/transfer`)
      .send({ toAccountId: toAccountId, amount: 50 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Identifiant de compte source invalide');
  });
  test('should fail if destination account id not a number', async () => {
    const res = await request(app)
      .post(`/accounts/${fromAccountId}/transfer`)
      .send({ toAccountId: 'notANumber', amount: 50 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Identifiant de compte destination invalide');
  });
  test('should fail if amount not a number', async () => {
    const res = await request(app)
      .post(`/accounts/${fromAccountId}/transfer`)
      .send({ toAccountId: toAccountId, amount: 'notANumber' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Montant invalide');
  });
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

    const beforeFrom = await Account.findByPk(fromAccountId);
    const beforeTo = await Account.findByPk(toAccountId);

    const res = await request(app)
      .post(`/accounts/${fromAccountId}/transfer`)
      .send({ toAccountId, amount });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Transfert réussi');

    const afterFrom = await Account.findByPk(fromAccountId);
    const afterTo = await Account.findByPk(toAccountId);

    expect(parseFloat(afterFrom.balance)).toBe(parseFloat(beforeFrom.balance) - amount);
    expect(parseFloat(afterTo.balance)).toBe(parseFloat(beforeTo.balance) + amount);
  });
});

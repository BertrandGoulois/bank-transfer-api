const request = require('supertest');
const app = require('../server');
const { sequelize, User, Account } = require('../models');

let accountId;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const user1 = await User.create({ name: 'Bertrand', email: 'bertrand@mail.com' });
  const account1 = await Account.create({ userId: user1.id, type: 'checking', balance: 500 });

  accountId = account1.id;
});

describe('Withdrawal endpoint', () => {
  test('should fail if account id not a number', async () => {
    const res = await request(app)
      .post(`/accounts/notANumber/withdraw`)
      .send({ amount : 10});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Identifiant de compte invalide');
  });

  test('should fail if amount not a number', async () => {
    const res = await request(app)
      .post(`/accounts/${accountId}/withdraw`)
      .send({ amount: 'notANumber' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Montant invalide');
  });

  test(`should fail if account does not exist`, async() => {
    const res = await request(app)
      .post(`/accounts/9999/withdraw`)
      .send({ amount : 10});

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Compte introuvable');
  });

  test('should fail if source has insufficient balance', async () => {
    const res = await request(app)
      .post(`/accounts/${accountId}/withdraw`)
      .send({ amount: 9999 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Solde insuffisant');
  });
});

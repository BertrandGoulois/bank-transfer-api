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

  test('should fail if account id is missing', async () => {
    const res = await request(app).get(`/accounts//transfer`);
    expect(res.status).toBe(404);
  });

  // Middleware validation tests
  test('should fail if request body is missing required fields', async () => {
    const res = await request(app)
      .post(`/accounts/${fromAccountId}/transfer`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Missing required fields');
  });

  test('should fail if amount is not a number', async () => {
    const res = await request(app)
      .post(`/accounts/${fromAccountId}/transfer`)
      .send({ toAccountId: toAccountId, amount: 'notANumber' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Amount must be a positive number');
  });

  test('should fail if sender and receiver accounts are identical', async () => {
    const res = await request(app)
      .post(`/accounts/${fromAccountId}/transfer`)
      .send({ toAccountId: fromAccountId, amount: 50 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Sender and receiver must be different');
  });

  // Business logic tests (handled by the service)
  test('should fail if sender account does not exist', async () => {
    const res = await request(app)
      .post('/accounts/9999/transfer')
      .send({ toAccountId: toAccountId, amount: 50 });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Sender account not found');
  });

  test('should fail if receiver account does not exist', async () => {
    const res = await request(app)
      .post(`/accounts/${fromAccountId}/transfer`)
      .send({ toAccountId: 9999, amount: 50 });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Receiver account not found');
  });

  test('should fail if source has insufficient balance', async () => {
    const res = await request(app)
      .post(`/accounts/${fromAccountId}/transfer`)
      .send({ toAccountId: toAccountId, amount: 9999 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Insufficient balance');
  });

  test('should succeed and update balances', async () => {
    const amount = 50;

    const beforeFrom = await Account.findByPk(fromAccountId);
    const beforeTo = await Account.findByPk(toAccountId);

    const res = await request(app)
      .post(`/accounts/${fromAccountId}/transfer`)
      .send({ toAccountId: toAccountId, amount });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Transfer successful');

    const afterFrom = await Account.findByPk(fromAccountId);
    const afterTo = await Account.findByPk(toAccountId);

    expect(parseFloat(afterFrom.balance)).toBe(parseFloat(beforeFrom.balance) - amount);
    expect(parseFloat(afterTo.balance)).toBe(parseFloat(beforeTo.balance) + amount);
  });

});

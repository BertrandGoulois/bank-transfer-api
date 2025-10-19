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
  test('should reach withdrawal endpoint', async () => {
    const res = await request(app)
      .post(`/accounts/${accountId}/withdraw`)
      .send({ amount: 10 });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Endpoint withdraw atteint');
  });
});

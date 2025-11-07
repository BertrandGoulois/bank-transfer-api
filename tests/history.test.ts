import request from 'supertest';
import app from '../server';
import { sequelize, User, Account, Transaction } from '../models';
import bcrypt from 'bcrypt';

let accountId: number;
let token: string;
let insertedTransactions: any[] = [];

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const passwordHash = await bcrypt.hash('password123', 10);
  const user = await User.create({ name: 'Bertrand', email: 'bertrand@mail.com', password: passwordHash });
  const account = await Account.create({ userId: user.id, type: 'checking', balance: 500 });

  insertedTransactions = await Transaction.bulkCreate([
    { accountId: account.id, type: 'credit', amount: 200, description: 'Salary', createdAt: new Date('2025-10-15') },
    { accountId: account.id, type: 'debit', amount: 50, description: 'Groceries', createdAt: new Date('2025-10-16') },
    { accountId: account.id, type: 'debit', amount: 20, description: 'Transport', createdAt: new Date('2025-10-17') },
    { accountId: account.id, type: 'credit', amount: 100, description: 'Friend transfer', createdAt: new Date('2025-10-17') }
  ]);

  accountId = account.id;

  const res = await request(app).post('/auth/login').send({ email: 'bertrand@mail.com', password: 'password123' });
  token = res.body.token;
});

describe('History endpoint', () => {
  test('should fail if account id is not a number', async () => {
    const res = await request(app)
      .get(`/accounts/notANumber/history`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid account id');
  });

  test('should fail if account does not exist', async () => {
    const res = await request(app)
      .get(`/accounts/9999/history`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Account not found');
  });

  test('should return correct metrics for account history', async () => {
    const res = await request(app)
      .get(`/accounts/${accountId}/history`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);

    const amounts = insertedTransactions.map(t => parseFloat(t.amount));
    const expectedAverage = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    expect(parseFloat(res.body.metrics.averageAmount)).toBeCloseTo(expectedAverage);

    const byType = insertedTransactions.reduce((acc: any, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1;
      return acc;
    }, {});
    expect(res.body.metrics.byType.credit).toBe(byType.credit);
    expect(res.body.metrics.byType.debit).toBe(byType.debit);

    const byDay = insertedTransactions.reduce((acc: any, t) => {
      const day = t.createdAt.toISOString().split('T')[0];
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});
    expect(res.body.metrics.byDay).toEqual(byDay);
  });
});

const request = require('supertest');
const app = require('../server');
const { sequelize, User, Account, Transaction } = require('../models');

let accountId;
let insertedTransactions = [];

beforeAll(async () => {
    await sequelize.sync({ force: true });

    const user = await User.create({ name: 'Bertrand', email: 'bertrand@mail.com' });
    const account = await Account.create({ userId: user.id, type: 'checking', balance: 500 });

    insertedTransactions = await Transaction.bulkCreate([
        { accountId: account.id, type: 'credit', amount: 200, description: 'Salaire', createdAt: new Date('2025-10-15') },
        { accountId: account.id, type: 'debit', amount: 50, description: 'Courses', createdAt: new Date('2025-10-16') },
        { accountId: account.id, type: 'debit', amount: 20, description: 'Transport', createdAt: new Date('2025-10-17') },
        { accountId: account.id, type: 'credit', amount: 100, description: 'Virement ami', createdAt: new Date('2025-10-17') }
    ]);

    accountId = account.id;
});

describe('History endpoint', () => {
    test('should fail if account id not a number', async () => {
        const res = await request(app)
            .get(`/accounts/notANumber/history`);

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Identifiant de compte invalide');
    });
    test(`should fail if account does not exist`, async () => {
        const res = await request(app)
            .get(`/accounts/9999/history`)

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Compte introuvable');
    });
    test('should return correct metrics for account history', async () => {
        const res = await request(app).get(`/accounts/${accountId}/history`);
        expect(res.status).toBe(200);

        const amounts = insertedTransactions.map(t => parseFloat(t.amount));
        const expectedAverage = amounts.reduce((a, b) => a + b, 0) / amounts.length;

        expect(parseFloat(res.body.metrics.averageAmount)).toBeCloseTo(expectedAverage);

        const byType = insertedTransactions.reduce((acc, t) => {
            acc[t.type] = (acc[t.type] || 0) + 1;
            return acc;
        }, {});

        expect(res.body.metrics.byType.deposit).toBe(byType.deposit);
        expect(res.body.metrics.byType.withdrawal).toBe(byType.withdrawal);

        const byDay = insertedTransactions.reduce((acc, t) => {
            const day = t.createdAt.toISOString().split('T')[0];
            acc[day] = (acc[day] || 0) + 1;
            return acc;
        }, {});

        expect(res.body.metrics.byDay).toEqual(byDay);
    });
});
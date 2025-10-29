const request = require('supertest');
const app = require('../server');
const { sequelize, User, Account } = require('../models');

let accountId;

beforeAll(async () => {
    await sequelize.sync({ force: true });

    const user = await User.create({ name: 'Bertrand', email: 'bertrand@mail.com' });
    const account = await Account.create({ userId: user.id, type: 'checking', balance: 500 });

    accountId = account.id;
});

describe('Withdrawal endpoint', () => {

    // Middleware validation tests
    test('should fail if account id is not a number', async () => {
        const res = await request(app)
            .post(`/accounts/notANumber/withdraw`)
            .send({ amount: 10 });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Invalid account id');
    });

    test('should fail if amount is missing', async () => {
        const res = await request(app)
            .post(`/accounts/${accountId}/withdraw`)
            .send({});

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Missing amount');
    });

    test('should fail if amount is not a number', async () => {
        const res = await request(app)
            .post(`/accounts/${accountId}/withdraw`)
            .send({ amount: 'notANumber' });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Amount must be a positive number');
    });

    test('should fail if account does not exist', async () => {
        const res = await request(app)
            .post(`/accounts/9999/withdraw`)
            .send({ amount: 10 });

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Account not found');
    });

    test('should fail if account has insufficient balance', async () => {
        const res = await request(app)
            .post(`/accounts/${accountId}/withdraw`)
            .send({ amount: 9999 });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Insufficient balance');
    });

    // Successful withdrawal
    test('should succeed and update account balance', async () => {
        const amount = 50;
        const before = await Account.findByPk(accountId);

        const res = await request(app)
            .post(`/accounts/${accountId}/withdraw`)
            .send({ amount });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Withdrawal successful');

        const after = await Account.findByPk(accountId);
        expect(parseFloat(after.balance)).toBe(parseFloat(before.balance) - amount);
    });

});

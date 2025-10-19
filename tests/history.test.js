const request = require('supertest');
const app = require('../server');
const { sequelize, User, Account, Transaction } = require('../models');

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
});
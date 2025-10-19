const request = require('supertest');
const app = require('../server');
const { sequelize, User, Account, Transaction } = require('../models');

describe('History endpoint', () => {
    test(`should reach history service`, async() => {
        const res = await request(app)
          .get(`/accounts/1/history`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Endpoint history atteint');
    });
});
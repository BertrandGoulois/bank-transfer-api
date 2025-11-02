const request = require('supertest');
const app = require('../server');
const { sequelize, User } = require('../models');
const bcrypt = require('bcrypt');

let user;

beforeAll(async () => {
    await sequelize.sync({ force: true });

    const passwordHash = await bcrypt.hash('password123', 10);
    user = await User.create({ name: 'Bertrand', email: 'bertrand@mail.com', password: passwordHash });
});

describe('Authentication', () => {
    test('should login successfully with correct credentials', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'bertrand@mail.com', password: 'password123' });

        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    test('should fail login with wrong email', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'wrong@mail.com', password: 'password123' });

        expect(res.status).toBe(401);
        expect(res.body.error).toBe('Invalid credentials');
    });

    test('should fail login with wrong password', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'bertrand@mail.com', password: 'wrongpass' });

        expect(res.status).toBe(401);
        expect(res.body.error).toBe('Invalid credentials');
    });
});

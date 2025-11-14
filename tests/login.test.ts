import request from 'supertest';
import app from '../server';
import { sequelize, UserModel as User } from '../models';
import bcrypt from 'bcrypt';

let user: InstanceType<typeof User>;

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
    expect(res.body.error).toBe('Authentication failed');
  });

  test('should fail login with wrong password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'bertrand@mail.com', password: 'wrongpass' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Authentication failed');
  });
});

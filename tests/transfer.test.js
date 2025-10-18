const request = require('supertest');
const app = require('../server');

describe('Premier test du endpoint de transfert', () => {
    test('should fail if accounts are the same', async () => {
    const res = await request(app)
        .post('/accounts/test/transfer')
        .send({ toAccountId: 'test', amount: 50 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Les deux comptes ne peuvent être identiques');
    });
    test('should reach transfer service', async () => {
    const res = await request(app)
      .post('/accounts/test/transfer')
      .send({ toAccountId: 'test2', amount: 50 });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Transfer service reached');
  });
});
const request = require('supertest');
const app = require('../server');
const { sequelize } = require('../models');

let accountId;

beforeAll(async () => {

  await sequelize.query(
    `truncate table "Users" RESTART IDENTITY CASCADE;`, { type : sequelize.QueryTypes.RAW}
  );
  await sequelize.query(
    `truncate table "Accounts" RESTART IDENTITY CASCADE;`, { type : sequelize.QueryTypes.RAW}
  );

  await sequelize.query(
    `truncate table "Transactions" RESTART IDENTITY CASCADE;`, { type : sequelize.QueryTypes.RAW}
  );

  const [user1] = await sequelize.query(
    `INSERT INTO "Users" (name, email, "createdAt","updatedAt") 
     VALUES ('Bertrand','bertrand@mail.com',NOW(),NOW()) RETURNING id`,
    { type: sequelize.QueryTypes.INSERT }
  );
  const [account1] = await sequelize.query(
    `INSERT INTO "Accounts" ("userId","type","balance","createdAt","updatedAt") 
     VALUES (:userId,'checking',500,NOW(),NOW()) RETURNING id`,
    { replacements: { userId: user1[0].id }, type: sequelize.QueryTypes.INSERT }
  );

  accountId = account1[0].id;
});

describe('Withdrawal endpoint', () => {
    test('should reach withdrawal endpoint', async () => {
        const res = await request(app)
          .post(`/accounts/${accountId}/withdraw`)
          .send({amount: 10});

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Endpoint withdraw atteint');
    });
});
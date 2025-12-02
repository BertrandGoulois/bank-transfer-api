import request from 'supertest';
import express from 'express';
import { AccountController } from '../../../../src/interface/http/controllers/AccountController';
import { DepositMoney } from '../../../../src/application/use-cases/DepositMoney';
import { WithdrawMoney } from '../../../../src/application/use-cases/WithdrawMoney';
import { TransferMoney } from '../../../../src/application/use-cases/TransferMoney';
import { SequelizeAccountRepository } from '../../../../src/infrastructure/db/repositories/SequelizeAccountRepository';

// mock entire repos and use cases
jest.mock('../../../../src/application/use-cases/DepositMoney');
jest.mock('../../../../src/application/use-cases/WithdrawMoney');
jest.mock('../../../../src/application/use-cases/TransferMoney');
jest.mock('../../../../src/infrastructure/db/repositories/SequelizeAccountRepository');

const app = express();
app.use(express.json());

const controller = new AccountController();

app.post('/deposit', (req, res) => controller.deposit(req, res));
app.post('/withdraw', (req, res) => controller.withdraw(req, res));
app.post('/transfer', (req, res) => controller.transfer(req, res));
app.get('/accounts/:accountId', (req, res) => controller.getAccount(req, res));

describe('AccountController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deposit → returns 200 on success', async () => {
        (DepositMoney.prototype.execute as jest.Mock).mockResolvedValue(undefined);

        const res = await request(app)
            .post('/deposit')
            .send({ accountId: 1, amount: 100 });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Deposit successful' });
        expect(DepositMoney.prototype.execute).toHaveBeenCalledWith(1, 100);
    });

    it('deposit → returns 400 on validation failure', async () => {
        const res = await request(app)
            .post('/deposit')
            .send({ amount: 100 });

        expect(res.status).toBe(400);
    });

    it('deposit → returns error from use-case', async () => {
        (DepositMoney.prototype.execute as jest.Mock).mockRejectedValue(
            new Error('Boom')
        );

        const res = await request(app)
            .post('/deposit')
            .send({ accountId: 1, amount: 100 });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Boom');
    });

    it('withdraw → returns 200 on success', async () => {
        (WithdrawMoney.prototype.execute as jest.Mock).mockResolvedValue(undefined);

        const res = await request(app)
            .post('/withdraw')
            .send({ accountId: 1, amount: 50 });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Withdrawal successful' });
        expect(WithdrawMoney.prototype.execute).toHaveBeenCalledWith(1, 50);
    });

    it('transfer → returns 200 on success', async () => {
        (TransferMoney.prototype.execute as jest.Mock).mockResolvedValue(undefined);

        const res = await request(app)
            .post('/transfer')
            .send({ fromId: 1, toId: 2, amount: 100 });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Transfer successful' });
        expect(TransferMoney.prototype.execute).toHaveBeenCalledWith(1, 2, 100);
    });

    it('transfer → validation error', async () => {
        const res = await request(app)
            .post('/transfer')
            .send({ fromId: 1, amount: 100 });

        expect(res.status).toBe(400);
    });

    it('getAccount → returns 200 when found', async () => {
        (SequelizeAccountRepository.prototype.findById as jest.Mock).mockResolvedValue({
            id: 1,
            userId: 5,
            balance: 100,
            type: 'SAVINGS'
        });

        const res = await request(app).get('/accounts/1');

        expect(res.status).toBe(200);
        expect(res.body.id).toBe(1);
        expect(SequelizeAccountRepository.prototype.findById).toHaveBeenCalledWith(1);
    });

    it('getAccount → returns 404 when not found', async () => {
        (SequelizeAccountRepository.prototype.findById as jest.Mock).mockResolvedValue(null);

        const res = await request(app).get('/accounts/1');

        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Account not found');
    });

    it('getAccount → validation error', async () => {
        const res = await request(app).get('/accounts/not-a-number');

        expect(res.status).toBe(400);
    });
});

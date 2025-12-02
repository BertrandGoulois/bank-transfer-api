"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const AccountController_1 = require("../../../../src/interface/http/controllers/AccountController");
const DepositMoney_1 = require("../../../../src/application/use-cases/DepositMoney");
const WithdrawMoney_1 = require("../../../../src/application/use-cases/WithdrawMoney");
const TransferMoney_1 = require("../../../../src/application/use-cases/TransferMoney");
const SequelizeAccountRepository_1 = require("../../../../src/infrastructure/db/repositories/SequelizeAccountRepository");
// mock entire repos and use cases
jest.mock('../../../../src/application/use-cases/DepositMoney');
jest.mock('../../../../src/application/use-cases/WithdrawMoney');
jest.mock('../../../../src/application/use-cases/TransferMoney');
jest.mock('../../../../src/infrastructure/db/repositories/SequelizeAccountRepository');
const app = (0, express_1.default)();
app.use(express_1.default.json());
const controller = new AccountController_1.AccountController();
app.post('/deposit', (req, res) => controller.deposit(req, res));
app.post('/withdraw', (req, res) => controller.withdraw(req, res));
app.post('/transfer', (req, res) => controller.transfer(req, res));
app.get('/accounts/:accountId', (req, res) => controller.getAccount(req, res));
describe('AccountController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('deposit → returns 200 on success', async () => {
        DepositMoney_1.DepositMoney.prototype.execute.mockResolvedValue(undefined);
        const res = await (0, supertest_1.default)(app)
            .post('/deposit')
            .send({ accountId: 1, amount: 100 });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Deposit successful' });
        expect(DepositMoney_1.DepositMoney.prototype.execute).toHaveBeenCalledWith(1, 100);
    });
    it('deposit → returns 400 on validation failure', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/deposit')
            .send({ amount: 100 });
        expect(res.status).toBe(400);
    });
    it('deposit → returns error from use-case', async () => {
        DepositMoney_1.DepositMoney.prototype.execute.mockRejectedValue(new Error('Boom'));
        const res = await (0, supertest_1.default)(app)
            .post('/deposit')
            .send({ accountId: 1, amount: 100 });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Boom');
    });
    it('withdraw → returns 200 on success', async () => {
        WithdrawMoney_1.WithdrawMoney.prototype.execute.mockResolvedValue(undefined);
        const res = await (0, supertest_1.default)(app)
            .post('/withdraw')
            .send({ accountId: 1, amount: 50 });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Withdrawal successful' });
        expect(WithdrawMoney_1.WithdrawMoney.prototype.execute).toHaveBeenCalledWith(1, 50);
    });
    it('transfer → returns 200 on success', async () => {
        TransferMoney_1.TransferMoney.prototype.execute.mockResolvedValue(undefined);
        const res = await (0, supertest_1.default)(app)
            .post('/transfer')
            .send({ fromId: 1, toId: 2, amount: 100 });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'Transfer successful' });
        expect(TransferMoney_1.TransferMoney.prototype.execute).toHaveBeenCalledWith(1, 2, 100);
    });
    it('transfer → validation error', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/transfer')
            .send({ fromId: 1, amount: 100 });
        expect(res.status).toBe(400);
    });
    it('getAccount → returns 200 when found', async () => {
        SequelizeAccountRepository_1.SequelizeAccountRepository.prototype.findById.mockResolvedValue({
            id: 1,
            userId: 5,
            balance: 100,
            type: 'SAVINGS'
        });
        const res = await (0, supertest_1.default)(app).get('/accounts/1');
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(1);
        expect(SequelizeAccountRepository_1.SequelizeAccountRepository.prototype.findById).toHaveBeenCalledWith(1);
    });
    it('getAccount → returns 404 when not found', async () => {
        SequelizeAccountRepository_1.SequelizeAccountRepository.prototype.findById.mockResolvedValue(null);
        const res = await (0, supertest_1.default)(app).get('/accounts/1');
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Account not found');
    });
    it('getAccount → validation error', async () => {
        const res = await (0, supertest_1.default)(app).get('/accounts/not-a-number');
        expect(res.status).toBe(400);
    });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DepositMoney_1 = require("../../../src/application/use-cases/DepositMoney");
const entities_1 = require("../../../src/domain/entities");
describe('DepositMoney Use Case', () => {
    let accountRepo;
    let transactionRepo;
    let depositMoney;
    beforeEach(() => {
        accountRepo = {
            findById: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            transaction: jest.fn(),
            findByUserId: jest.fn(),
        };
        transactionRepo = {
            create: jest.fn(),
            findByAccountId: jest.fn(),
        };
        depositMoney = new DepositMoney_1.DepositMoney(accountRepo, transactionRepo);
    });
    it('should deposit money and create a transaction', async () => {
        const account = new entities_1.Account(1, 100, 0, 'SAVINGS');
        accountRepo.findById.mockResolvedValue(account);
        accountRepo.transaction.mockImplementation(async (cb) => cb({}));
        await depositMoney.execute(1, 50);
        expect(account.balance).toBe(50);
        expect(accountRepo.findById).toHaveBeenCalledWith(1);
        expect(accountRepo.save).toHaveBeenCalledWith(account);
        expect(transactionRepo.create).toHaveBeenCalledWith(expect.objectContaining({
            accountId: 1,
            type: 'DEPOSIT',
            amount: 50,
        }));
    });
    it('should throw if account not found', async () => {
        accountRepo.findById.mockResolvedValue(null);
        accountRepo.transaction.mockImplementation(async (cb) => cb({}));
        await expect(depositMoney.execute(999, 50)).rejects.toThrow('Account not found');
    });
});

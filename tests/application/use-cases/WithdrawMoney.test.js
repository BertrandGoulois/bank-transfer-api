"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WithdrawMoney_1 = require("../../../src/application/use-cases/WithdrawMoney");
const entities_1 = require("../../../src/domain/entities");
describe('WithdrawMoney Use Case', () => {
    let accountRepo;
    let transactionRepo;
    let withdrawMoney;
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
        withdrawMoney = new WithdrawMoney_1.WithdrawMoney(accountRepo, transactionRepo);
    });
    it('should withdraw money and create a transaction', async () => {
        const account = new entities_1.Account(1, 100, 100, 'SAVINGS');
        accountRepo.findById.mockResolvedValue(account);
        accountRepo.transaction.mockImplementation(async (cb) => cb({}));
        await withdrawMoney.execute(1, 50);
        expect(account.balance).toBe(50);
        expect(accountRepo.findById).toHaveBeenCalledWith(1);
        expect(accountRepo.save).toHaveBeenCalledWith(account);
        expect(transactionRepo.create).toHaveBeenCalledWith(expect.objectContaining({
            accountId: 1,
            type: 'WITHDRAWAL',
            amount: 50,
        }));
    });
    it('should throw if account not found', async () => {
        accountRepo.findById.mockResolvedValue(null);
        accountRepo.transaction.mockImplementation(async (cb) => cb({}));
        await expect(withdrawMoney.execute(999, 50)).rejects.toThrow('Account not found');
    });
});

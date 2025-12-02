"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GetTransactionStats_1 = require("../../../src/application/use-cases/GetTransactionStats");
const transactionFactory_1 = require("../../factories/transactionFactory");
describe('GetTransactionStats Use Case', () => {
    let accountRepo;
    let transactionRepo;
    let getTransactionStats;
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
        getTransactionStats = new GetTransactionStats_1.GetTransactionStats(accountRepo, transactionRepo);
    });
    it('should compute statistics correctly', async () => {
        const transactions = [
            (0, transactionFactory_1.makeTransaction)({ accountId: 1, amount: 100, type: 'DEPOSIT', createdAt: new Date('2025-12-01') }),
            (0, transactionFactory_1.makeTransaction)({ accountId: 1, amount: 50, type: 'WITHDRAWAL', createdAt: new Date('2025-12-01') }),
            (0, transactionFactory_1.makeTransaction)({ accountId: 1, amount: 200, type: 'DEPOSIT', createdAt: new Date('2025-12-02') }),
        ];
        accountRepo.findById.mockResolvedValue({ id: 1 });
        accountRepo.transaction.mockImplementation(async (cb) => cb({}));
        transactionRepo.findByAccountId.mockResolvedValue(transactions);
        const result = await getTransactionStats.execute(1);
        expect(result.transactions).toHaveLength(3);
        expect(result.averageAmount).toBeCloseTo((100 + 50 + 200) / 3);
        expect(result.byType['DEPOSIT']).toBe(2);
        expect(result.byType['WITHDRAWAL']).toBe(1);
        expect(result.byDay['2025-12-01']).toBe(2);
        expect(result.byDay['2025-12-02']).toBe(1);
    });
    it('should throw if account not found', async () => {
        accountRepo.findById.mockResolvedValue(null);
        accountRepo.transaction.mockImplementation(async (cb) => cb({}));
        await expect(getTransactionStats.execute(999)).rejects.toThrow('Account not found');
    });
});

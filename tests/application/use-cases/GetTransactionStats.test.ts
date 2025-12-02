import { GetTransactionStats, TransactionStatsDTO } from '../../../src/application/use-cases/GetTransactionStats';
import { AccountRepository, TransactionRepository } from '../../../src/domain/repositories';
import { makeTransaction } from '../../factories/transactionFactory';
import { Transaction } from '../../../src/domain/entities/Transaction';

describe('GetTransactionStats Use Case', () => {
  let accountRepo: jest.Mocked<AccountRepository>;
  let transactionRepo: jest.Mocked<TransactionRepository>;
  let getTransactionStats: GetTransactionStats;

  beforeEach(() => {
    accountRepo = {
      findById: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      transaction: jest.fn(),
      findByUserId: jest.fn(),
    } as any;

    transactionRepo = {
      create: jest.fn(),
      findByAccountId: jest.fn(),
    } as any;

    getTransactionStats = new GetTransactionStats(accountRepo, transactionRepo);
  });

  it('should compute statistics correctly', async () => {
    const transactions: Transaction[] = [
      makeTransaction({ accountId: 1, amount: 100, type: 'DEPOSIT', createdAt: new Date('2025-12-01') }),
      makeTransaction({ accountId: 1, amount: 50, type: 'WITHDRAWAL', createdAt: new Date('2025-12-01') }),
      makeTransaction({ accountId: 1, amount: 200, type: 'DEPOSIT', createdAt: new Date('2025-12-02') }),
    ];

    accountRepo.findById.mockResolvedValue({ id: 1 } as any);
    accountRepo.transaction.mockImplementation(async (cb) => cb({} as any));
    transactionRepo.findByAccountId.mockResolvedValue(transactions);

    const result: TransactionStatsDTO = await getTransactionStats.execute(1);

    expect(result.transactions).toHaveLength(3);
    expect(result.averageAmount).toBeCloseTo((100 + 50 + 200) / 3);
    expect(result.byType['DEPOSIT']).toBe(2);
    expect(result.byType['WITHDRAWAL']).toBe(1);
    expect(result.byDay['2025-12-01']).toBe(2);
    expect(result.byDay['2025-12-02']).toBe(1);
  });

  it('should throw if account not found', async () => {
    accountRepo.findById.mockResolvedValue(null);
    accountRepo.transaction.mockImplementation(async (cb) => cb({} as any));

    await expect(getTransactionStats.execute(999)).rejects.toThrow('Account not found');
  });
});

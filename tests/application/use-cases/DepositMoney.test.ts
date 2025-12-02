import { DepositMoney } from '../../../src/application/use-cases/DepositMoney';
import { AccountRepository, TransactionRepository } from '../../../src/domain/repositories';
import { Account , Transaction } from '../../../src/domain/entities';

describe('DepositMoney Use Case', () => {
  let accountRepo: jest.Mocked<AccountRepository>;
  let transactionRepo: jest.Mocked<TransactionRepository>;
  let depositMoney: DepositMoney;

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

    depositMoney = new DepositMoney(accountRepo, transactionRepo);
  });

  it('should deposit money and create a transaction', async () => {
    const account = new Account(1, 100, 0, 'SAVINGS');
    accountRepo.findById.mockResolvedValue(account);
    accountRepo.transaction.mockImplementation(async (cb) => cb({} as any));

    await depositMoney.execute(1, 50);

    expect(account.balance).toBe(50);
    expect(accountRepo.findById).toHaveBeenCalledWith(1);
    expect(accountRepo.save).toHaveBeenCalledWith(account);
    expect(transactionRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        accountId: 1,
        type: 'DEPOSIT',
        amount: 50,
      } as Transaction)
    );
  });

  it('should throw if account not found', async () => {
    accountRepo.findById.mockResolvedValue(null);
    accountRepo.transaction.mockImplementation(async (cb) => cb({} as any));

    await expect(depositMoney.execute(999, 50)).rejects.toThrow('Account not found');
  });
});

import { WithdrawMoney } from '../../../src/application/use-cases/WithdrawMoney';
import { AccountRepository, TransactionRepository } from '../../../src/domain/repositories';
import { Account, Transaction } from '../../../src/domain/entities';

describe('WithdrawMoney Use Case', () => {
    let accountRepo: jest.Mocked<AccountRepository>;
    let transactionRepo: jest.Mocked<TransactionRepository>;
    let withdrawMoney: WithdrawMoney;

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

        withdrawMoney = new WithdrawMoney(accountRepo, transactionRepo);

    });

    it('should withdraw money and create a transaction', async () => {
        const account = new Account(1, 100, 100, 'SAVINGS');
        accountRepo.findById.mockResolvedValue(account);
        accountRepo.transaction.mockImplementation(async (cb) => cb({} as any));

        await withdrawMoney.execute(1, 50);

        expect(account.balance).toBe(50);
        expect(accountRepo.findById).toHaveBeenCalledWith(1);
        expect(accountRepo.save).toHaveBeenCalledWith(account);
        expect(transactionRepo.create).toHaveBeenCalledWith(
            expect.objectContaining({
                accountId: 1,
                type: 'WITHDRAWAL',
                amount: 50,
            } as Transaction)
        );
    });

    it('should throw if account not found', async () => {
        accountRepo.findById.mockResolvedValue(null);
        accountRepo.transaction.mockImplementation(async (cb) => cb({} as any));

        await expect(withdrawMoney.execute(999, 50)).rejects.toThrow('Account not found');
    });

});
import { TransferMoney } from '../../../src/application/use-cases/TransferMoney';
import { AccountRepository, TransactionRepository } from '../../../src/domain/repositories';
import { Account, Transaction } from '../../../src/domain/entities';

describe('TransferMoney Use Case', () => {
    let accountRepo: jest.Mocked<AccountRepository>;
    let transactionRepo: jest.Mocked<TransactionRepository>;
    let transferMoney: TransferMoney;

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

        transferMoney = new TransferMoney(accountRepo, transactionRepo);
    });

    it('should transfer money and create a transaction', async () => {
        const fromAccount = new Account(1, 1, 100, 'SAVINGS');
        const toAccount = new Account(2, 2, 0, 'SAVINGS');

        accountRepo.findById.mockImplementation(async (id: number) =>
            id === 1 ? fromAccount : id === 2 ? toAccount : null
        );

        accountRepo.transaction.mockImplementation(async (cb) => cb({} as any));

        await transferMoney.execute(1, 2, 50);

        expect(fromAccount.balance).toBe(50);
        expect(toAccount.balance).toBe(50);

        expect(accountRepo.findById).toHaveBeenCalledWith(1, expect.anything());
        expect(accountRepo.findById).toHaveBeenCalledWith(2, expect.anything());
        expect(accountRepo.save).toHaveBeenCalledWith(fromAccount);
        expect(accountRepo.save).toHaveBeenCalledWith(toAccount);
        expect(transactionRepo.create).toHaveBeenCalledWith(
            expect.objectContaining({
                accountId: 1,
                type: 'TRANSFER',
                amount: 50,
            } as Transaction)
        );

        expect(accountRepo.transaction).toHaveBeenCalled();
    });

    it('should throw if any account not found', async () => {
        accountRepo.findById.mockResolvedValue(null);
        accountRepo.transaction.mockImplementation(async (cb) => cb({} as any));

        await expect(transferMoney.execute(999, 2, 50)).rejects.toThrow('Account not found');
        await expect(transferMoney.execute(1, 999, 50)).rejects.toThrow('Account not found');
    });
});
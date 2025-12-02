import { SequelizeTransactionRepository } from '../../../src/infrastructure/db/repositories/SequelizeTransactionRepository';
import { TransactionModel } from '../../../src/infrastructure/db/models/TransactionModel';
import { Transaction } from '../../../src/domain/entities';

jest.mock('../../../src/infrastructure/db/models/TransactionModel');

describe('SequelizeTransactionRepository', () => {
    let repo: SequelizeTransactionRepository;

    beforeEach(() => {
        jest.clearAllMocks();
        repo = new SequelizeTransactionRepository();
    });

    it('should find a transaction by ID', async () => {
        const mockRecord = {
            id: 1,
            accountId: 10,
            type: 'DEPOSIT',
            amount: 100,
            description: 'test deposit',
            createdAt: new Date()
        };

        (TransactionModel.findByPk as jest.Mock).mockResolvedValue(mockRecord);

        const tx = await repo.findById(1);

        expect(tx).toBeInstanceOf(Transaction);
        expect(tx?.id).toBe(1);
        expect(TransactionModel.findByPk).toHaveBeenCalledWith(1);
    });

    it('should return null if transaction not found', async () => {
        (TransactionModel.findByPk as jest.Mock).mockResolvedValue(null);

        const tx = await repo.findById(1);

        expect(tx).toBeNull();
    });

    it('should find transactions by account ID', async () => {
        const mockRecords = [
            { id: 1, accountId: 10, type: 'DEPOSIT', amount: 50, description: 'd1', createdAt: new Date() },
            { id: 2, accountId: 10, type: 'WITHDRAWAL', amount: 20, description: 'w1', createdAt: new Date() }
        ];

        (TransactionModel.findAll as jest.Mock).mockResolvedValue(mockRecords);

        const transactions = await repo.findByAccountId(10);

        expect(transactions).toHaveLength(2);
        expect(transactions[0]).toBeInstanceOf(Transaction);
        expect(TransactionModel.findAll).toHaveBeenCalledWith({ where: { accountId: 10 } });
    });

    it('should save an existing transaction', async () => {
        const tx = new Transaction(1, 10, 'DEPOSIT', 100, 'desc', new Date());

        (TransactionModel.update as jest.Mock).mockResolvedValue([1]); // sequelize returns [affectedRows]

        await repo.save(tx);

        expect(TransactionModel.update).toHaveBeenCalledWith(
            { accountId: 10, type: 'DEPOSIT', amount: 100, description: 'desc' },
            { where: { id: 1 } }
        );
    });

    it('should create a new transaction', async () => {
        const tx = new Transaction(1, 10, 'DEPOSIT', 100, 'desc', new Date());

        const mockRecord = { ...tx, createdAt: tx.createdAt };

        (TransactionModel.create as jest.Mock).mockResolvedValue(mockRecord);

        const created = await repo.create(tx);

        expect(TransactionModel.create).toHaveBeenCalledWith({
            id: 1,
            accountId: 10,
            type: 'DEPOSIT',
            amount: 100,
            description: 'desc'
        });

        expect(created).toBeInstanceOf(Transaction);
        expect(created.id).toBe(1);
    });

    it('should throw error if invalid transaction type returned from DB', async () => {
        const mockRecord = {
            id: 1,
            accountId: 10,
            type: 'INVALID',
            amount: 100,
            description: 'desc',
            createdAt: new Date()
        };

        (TransactionModel.findByPk as jest.Mock).mockResolvedValue(mockRecord);

        await expect(repo.findById(1)).rejects.toThrow('Invalid transaction type from DB');
    });
});

import { SequelizeAccountRepository } from '../../../src/infrastructure/db/repositories/SequelizeAccountRepository';
import { AccountModel } from '../../../src/infrastructure/db/models/AccountModel';
import { Account } from '../../../src/domain/entities';
import { sequelize } from '../../../src/infrastructure/db/sequelize';

describe('SequelizeAccountRepository', () => {
    let repo: SequelizeAccountRepository;

    beforeEach(() => {
        jest.restoreAllMocks();
        repo = new SequelizeAccountRepository();
    });

    it('should find an account by ID', async () => {
        const mockRecord = {
            id: 1,
            userId: 1,
            balance: 0,
            type: 'SAVINGS',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        jest.spyOn(AccountModel, 'findByPk').mockResolvedValue(mockRecord as any);

        const account = await repo.findById(1);

        expect(account).toBeInstanceOf(Account);
        expect(account?.id).toBe(1);
        expect(AccountModel.findByPk).toHaveBeenCalledWith(
            1,
            expect.objectContaining({ lock: undefined })
        );
    });

    it('should return null if account not found', async () => {
        jest.spyOn(AccountModel, 'findByPk').mockResolvedValue(null as any);

        const result = await repo.findById(1);

        expect(result).toBeNull();
    });

    it('should find accounts by user id', async () => {
        const mockRecords = [
            { id: 1, userId: 1, balance: 0, type: 'SAVINGS', createdAt: new Date(), updatedAt: new Date() },
            { id: 2, userId: 1, balance: 0, type: 'SAVINGS', createdAt: new Date(), updatedAt: new Date() }
        ];

        jest.spyOn(AccountModel, 'findAll').mockResolvedValue(mockRecords as any);

        const accounts = await repo.findByUserId(1);

        expect(accounts).toHaveLength(2);
        expect(accounts[0]).toBeInstanceOf(Account);
        expect(AccountModel.findAll).toHaveBeenCalledWith(
            { where: { userId: 1 }, lock: undefined }
        );
    });

    it('should save an existing account', async () => {
        const account = new Account(1, 1, 50, 'SAVINGS');

        jest.spyOn(AccountModel, 'update').mockResolvedValue([1] as any);

        await repo.save(account);

        expect(AccountModel.update).toHaveBeenCalledWith(
            { balance: 50, type: 'SAVINGS' },
            { where: { id: 1 } }
        );
    });

    it('should create a new account', async () => {
        const account = new Account(1, 1, 100, 'CHECKING');

        jest.spyOn(AccountModel, 'create').mockResolvedValue({
            id: 1,
            userId: 1,
            balance: 100,
            type: 'CHECKING'
        } as any);

        const created = await repo.create(account);

        expect(AccountModel.create).toHaveBeenCalledWith({
            id: 1,
            userId: 1,
            balance: 100,
            type: 'CHECKING'
        });

        expect(created).toBeInstanceOf(Account);
        expect(created.id).toBe(1);
    });

    it('should execute callback inside a sequelize transaction', async () => {
        const mockTransaction = { id: 'T123' } as any;

        jest.spyOn(sequelize, 'transaction').mockImplementation(async (cb: any) => {
            return cb(mockTransaction);
        });

        const callback = jest.fn(async () => 42);

        const result = await repo.transaction(callback);

        expect(sequelize.transaction).toHaveBeenCalled();
        expect(callback).toHaveBeenCalledWith(mockTransaction);
        expect(result).toBe(42);
    });
});

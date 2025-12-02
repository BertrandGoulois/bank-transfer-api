"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SequelizeAccountRepository_1 = require("../../../src/infrastructure/db/repositories/SequelizeAccountRepository");
const AccountModel_1 = require("../../../src/infrastructure/db/models/AccountModel");
const entities_1 = require("../../../src/domain/entities");
const sequelize_1 = require("../../../src/infrastructure/db/sequelize");
describe('SequelizeAccountRepository', () => {
    let repo;
    beforeEach(() => {
        jest.restoreAllMocks();
        repo = new SequelizeAccountRepository_1.SequelizeAccountRepository();
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
        jest.spyOn(AccountModel_1.AccountModel, 'findByPk').mockResolvedValue(mockRecord);
        const account = await repo.findById(1);
        expect(account).toBeInstanceOf(entities_1.Account);
        expect(account?.id).toBe(1);
        expect(AccountModel_1.AccountModel.findByPk).toHaveBeenCalledWith(1, expect.objectContaining({ lock: undefined }));
    });
    it('should return null if account not found', async () => {
        jest.spyOn(AccountModel_1.AccountModel, 'findByPk').mockResolvedValue(null);
        const result = await repo.findById(1);
        expect(result).toBeNull();
    });
    it('should find accounts by user id', async () => {
        const mockRecords = [
            { id: 1, userId: 1, balance: 0, type: 'SAVINGS', createdAt: new Date(), updatedAt: new Date() },
            { id: 2, userId: 1, balance: 0, type: 'SAVINGS', createdAt: new Date(), updatedAt: new Date() }
        ];
        jest.spyOn(AccountModel_1.AccountModel, 'findAll').mockResolvedValue(mockRecords);
        const accounts = await repo.findByUserId(1);
        expect(accounts).toHaveLength(2);
        expect(accounts[0]).toBeInstanceOf(entities_1.Account);
        expect(AccountModel_1.AccountModel.findAll).toHaveBeenCalledWith({ where: { userId: 1 }, lock: undefined });
    });
    it('should save an existing account', async () => {
        const account = new entities_1.Account(1, 1, 50, 'SAVINGS');
        jest.spyOn(AccountModel_1.AccountModel, 'update').mockResolvedValue([1]);
        await repo.save(account);
        expect(AccountModel_1.AccountModel.update).toHaveBeenCalledWith({ balance: 50, type: 'SAVINGS' }, { where: { id: 1 } });
    });
    it('should create a new account', async () => {
        const account = new entities_1.Account(1, 1, 100, 'CHECKING');
        jest.spyOn(AccountModel_1.AccountModel, 'create').mockResolvedValue({
            id: 1,
            userId: 1,
            balance: 100,
            type: 'CHECKING'
        });
        const created = await repo.create(account);
        expect(AccountModel_1.AccountModel.create).toHaveBeenCalledWith({
            id: 1,
            userId: 1,
            balance: 100,
            type: 'CHECKING'
        });
        expect(created).toBeInstanceOf(entities_1.Account);
        expect(created.id).toBe(1);
    });
    it('should execute callback inside a sequelize transaction', async () => {
        const mockTransaction = { id: 'T123' };
        jest.spyOn(sequelize_1.sequelize, 'transaction').mockImplementation(async (cb) => {
            return cb(mockTransaction);
        });
        const callback = jest.fn(async () => 42);
        const result = await repo.transaction(callback);
        expect(sequelize_1.sequelize.transaction).toHaveBeenCalled();
        expect(callback).toHaveBeenCalledWith(mockTransaction);
        expect(result).toBe(42);
    });
});

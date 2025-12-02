import { TransactionController } from '../../../../src/interface/http/controllers/TransactionController';
import { Request, Response } from 'express';
import { SequelizeTransactionRepository } from '../../../../src/infrastructure/db/repositories/SequelizeTransactionRepository';
import { SequelizeAccountRepository } from '../../../../src/infrastructure/db/repositories/SequelizeAccountRepository';
import { GetTransactionStats } from '../../../../src/application/use-cases/GetTransactionStats';
import { Transaction } from '../../../../src/domain/entities';

describe('TransactionController', () => {
  let transactionRepo: jest.Mocked<SequelizeTransactionRepository>;
  let accountRepo: jest.Mocked<SequelizeAccountRepository>;
  let usecaseMock: jest.Mocked<GetTransactionStats>;
  let controller: TransactionController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    transactionRepo = {
      findById: jest.fn(),
      findByAccountId: jest.fn()
    } as any;

    accountRepo = {} as any; // only needed if you test stats use case

    usecaseMock = {
      execute: jest.fn()
    } as any;

    // Inject **instances**, not class
    controller = new TransactionController(transactionRepo, accountRepo, usecaseMock);

    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();
    res = { status: statusMock, json: jsonMock };
  });

  describe('getById', () => {
    it('returns 404 when transaction not found', async () => {
      transactionRepo.findById.mockResolvedValue(null as any);
      req = { params: { id: '1' } };
      await controller.getById(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(404);
    });

    it('returns 200 when transaction found', async () => {
      const tx = new Transaction(1, 10, 'DEPOSIT', 100, 'desc', new Date());
      transactionRepo.findById.mockResolvedValue(tx as any);
      req = { params: { id: '1' } };
      await controller.getById(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(tx);
    });
  });

  describe('getTransactionsStatsByAccountId', () => {
    it('returns 200 with stats', async () => {
      const stats = {
        averageAmount: 75,
        byType: { DEPOSIT: 1, WITHDRAWAL: 1 },
        byDay: { '2025-12-02': 2 },
        transactions: [
          new Transaction(1, 10, 'DEPOSIT', 100, 'desc', new Date()),
          new Transaction(2, 10, 'WITHDRAWAL', 50, 'desc', new Date())
        ]
      };

      usecaseMock.execute.mockResolvedValue(stats as any);
      req = { params: { accountId: '10' } };
      await controller.getTransactionsStatsByAccountId(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(stats);
    });

    it('returns 500 on use case error', async () => {
      usecaseMock.execute.mockRejectedValue(new Error());
      req = { params: { accountId: '10' } };
      await controller.getTransactionsStatsByAccountId(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(500);
    });
  });
});

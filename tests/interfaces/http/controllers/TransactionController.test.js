"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TransactionController_1 = require("../../../../src/interface/http/controllers/TransactionController");
const entities_1 = require("../../../../src/domain/entities");
describe('TransactionController', () => {
    let transactionRepo;
    let accountRepo;
    let usecaseMock;
    let controller;
    let req;
    let res;
    let statusMock;
    let jsonMock;
    beforeEach(() => {
        transactionRepo = {
            findById: jest.fn(),
            findByAccountId: jest.fn()
        };
        accountRepo = {}; // only needed if you test stats use case
        usecaseMock = {
            execute: jest.fn()
        };
        // Inject **instances**, not class
        controller = new TransactionController_1.TransactionController(transactionRepo, accountRepo, usecaseMock);
        statusMock = jest.fn().mockReturnThis();
        jsonMock = jest.fn();
        res = { status: statusMock, json: jsonMock };
    });
    describe('getById', () => {
        it('returns 404 when transaction not found', async () => {
            transactionRepo.findById.mockResolvedValue(null);
            req = { params: { id: '1' } };
            await controller.getById(req, res);
            expect(statusMock).toHaveBeenCalledWith(404);
        });
        it('returns 200 when transaction found', async () => {
            const tx = new entities_1.Transaction(1, 10, 'DEPOSIT', 100, 'desc', new Date());
            transactionRepo.findById.mockResolvedValue(tx);
            req = { params: { id: '1' } };
            await controller.getById(req, res);
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
                    new entities_1.Transaction(1, 10, 'DEPOSIT', 100, 'desc', new Date()),
                    new entities_1.Transaction(2, 10, 'WITHDRAWAL', 50, 'desc', new Date())
                ]
            };
            usecaseMock.execute.mockResolvedValue(stats);
            req = { params: { accountId: '10' } };
            await controller.getTransactionsStatsByAccountId(req, res);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(stats);
        });
        it('returns 500 on use case error', async () => {
            usecaseMock.execute.mockRejectedValue(new Error());
            req = { params: { accountId: '10' } };
            await controller.getTransactionsStatsByAccountId(req, res);
            expect(statusMock).toHaveBeenCalledWith(500);
        });
    });
});

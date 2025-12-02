import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController';
import { SequelizeTransactionRepository } from '../../../infrastructure/db/repositories/SequelizeTransactionRepository';
import { SequelizeAccountRepository } from '../../../infrastructure/db/repositories/SequelizeAccountRepository';
import { GetTransactionStats } from '../../../application/use-cases/GetTransactionStats';

const router = Router();

const transactionRepo = new SequelizeTransactionRepository();
const accountRepo = new SequelizeAccountRepository();

const getStatsUseCase = new GetTransactionStats(accountRepo, transactionRepo);

// pass the instance to the controller
const controller = new TransactionController(transactionRepo, accountRepo, getStatsUseCase);

router.get('/:id', (req, res) => controller.getById(req, res));
router.get('/account/:accountId', (req, res) => controller.getByAccountId(req, res));
router.get('/stats/:accountId', (req, res) => controller.getTransactionsStatsByAccountId(req, res));

export default router;

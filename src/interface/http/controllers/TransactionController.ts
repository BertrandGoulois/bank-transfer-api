import { Request, Response } from 'express';
import { AccountRepository, TransactionRepository } from '../../../domain/repositories';
import { GetTransactionStats } from '../../../application/use-cases/GetTransactionStats';
import { getByIdSchema } from '../../../schemas/transaction/getByIdSchema';
import { getByAccountIdSchema } from '../../../schemas/transaction/getByAccountIdSchema';
import { getTransactionsStatsByAccountIdSchema } from '../../../schemas/transaction/getTransactionsStatsByAccountIdSchema';

export class TransactionController {
  constructor(
    private transactionRepo: TransactionRepository,
    private accountRepo: AccountRepository,
    private getStatsUseCase: GetTransactionStats
  ) {}

  async getById(req: Request, res: Response) {
    const parsed = getByIdSchema.safeParse(req.params);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.issues });

    try {
      const tx = await this.transactionRepo.findById(parsed.data.id);
      if (!tx) return res.status(404).json({ error: 'Transaction not found' });
      res.status(200).json(tx);
    } catch {
      res.status(500).json({ error: 'Failed to fetch transaction' });
    }
  }

  async getByAccountId(req: Request, res: Response) {
    const parsed = getByAccountIdSchema.safeParse(req.params);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.issues });

    try {
      const list = await this.transactionRepo.findByAccountId(parsed.data.accountId);
      res.status(200).json(list);
    } catch {
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  }

  async getTransactionsStatsByAccountId(req: Request, res: Response) {
    const parsed = getTransactionsStatsByAccountIdSchema.safeParse(req.params);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.issues });

    try {
      const result = await this.getStatsUseCase.execute(parsed.data.accountId);
      res.status(200).json(result);
    } catch {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  }
}

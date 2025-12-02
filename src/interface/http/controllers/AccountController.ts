import { Request, Response } from 'express';
import { DepositMoney } from '../../../application/use-cases/DepositMoney';
import { WithdrawMoney } from '../../../application/use-cases/WithdrawMoney';
import { TransferMoney } from '../../../application/use-cases/TransferMoney';
import { SequelizeAccountRepository } from '../../../infrastructure/db/repositories/SequelizeAccountRepository';
import { SequelizeTransactionRepository } from '../../../infrastructure/db/repositories/SequelizeTransactionRepository';
import { depositSchema } from '../../../schemas/account/depositSchema';
import { withdrawalSchema } from '../../../schemas/account/withdrawalSchema';
import { transferSchema } from '../../../schemas/account/transferSchema';
import { getAccountSchema } from '../../../schemas/account/getAccountSchema';

const accountRepo = new SequelizeAccountRepository();
const transactionRepo = new SequelizeTransactionRepository();

const depositUseCase = new DepositMoney(accountRepo, transactionRepo);
const withdrawUseCase = new WithdrawMoney(accountRepo, transactionRepo);
const transferUseCase = new TransferMoney(accountRepo, transactionRepo);

export class AccountController {
    async deposit(req: Request, res: Response) {
        const parsed = depositSchema.safeParse(req.body);
        if (!parsed.success) {
            const errors = parsed.error.issues.map(i => ({ field: i.path.join('.'), message: i.message }));
            return res.status(400).json({ errors });
        }
        const { accountId, amount } = parsed.data;
        try {
            await depositUseCase.execute(accountId, amount);
            res.status(200).json({ message: 'Deposit successful' });
        } catch (err: any) {
            res.status(err.status ?? 400).json({ error: err.message });
        }
    }

    async withdraw(req: Request, res: Response) {
        const parsed = withdrawalSchema.safeParse(req.body);
        if (!parsed.success) {
            const errors = parsed.error.issues.map(i => ({ field: i.path.join('.'), message: i.message }));
            return res.status(400).json({ errors });
        }
        const { accountId, amount } = parsed.data;
        try {
            await withdrawUseCase.execute(accountId, amount);
            res.status(200).json({ message: 'Withdrawal successful' });
        } catch (err: any) {
            res.status(err.status ?? 400).json({ error: err.message });
        }
    }

    async transfer(req: Request, res: Response) {
        const parsed = transferSchema.safeParse(req.body);
        if (!parsed.success) {
            const errors = parsed.error.issues.map(i => ({ field: i.path.join('.'), message: i.message }));
            return res.status(400).json({ errors });
        }
        const { fromId, toId, amount } = parsed.data;
        try {
            await transferUseCase.execute(fromId, toId, amount);
            res.status(200).json({ message: 'Transfer successful' });
        } catch (err: any) {
            res.status(err.status ?? 400).json({ error: err.message });
        }
    }

    async getAccount(req: Request, res: Response) {
        const parsed = getAccountSchema.safeParse(req.params);
        if (!parsed.success) {
            const errors = parsed.error.issues.map(i => ({ field: i.path.join('.'), message: i.message }));
            return res.status(400).json({ errors });
        }
        const { accountId } = parsed.data;
        try {
            const account = await accountRepo.findById(Number(accountId));
            if (!account) return res.status(404).json({ error: 'Account not found' });
            res.status(200).json(account);
        } catch (err: any) {
            res.status(err.status ?? 400).json({ error: err.message });
        }
    }
}

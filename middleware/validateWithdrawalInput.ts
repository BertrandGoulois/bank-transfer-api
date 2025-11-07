import { Request, Response, NextFunction } from 'express';

const validateWithdrawalInput = (req: Request, res: Response, next: NextFunction) => {
    const accountId = req.params.accountId;
    const { amount } = req.body;

    if (isNaN(Number(accountId))) {
        return res.status(400).json({ error: 'Invalid account id' });
    }

    if (amount === undefined) {
        return res.status(400).json({ error: 'Missing amount' });
    }

    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    next();
}

export default validateWithdrawalInput;

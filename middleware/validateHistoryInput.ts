import { Request, Response, NextFunction } from 'express';

const validateHistoryInput = (req: Request, res: Response, next: NextFunction) => {
    const accountId = req.params.accountId;

    if (isNaN(Number(accountId))) {
        return res.status(400).json({ error: 'Invalid account id' });
    }

    next();
}


export default validateHistoryInput;
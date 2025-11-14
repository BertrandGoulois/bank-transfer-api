import { Request, Response } from 'express';
import withdraw from '../services/withdrawalService';

const postWithdrawal = async (req: Request, res: Response) => {
  const accountId = Number(req.params.accountId);
  const amount = Number(req.body.amount);

  try {
    const result = await withdraw(accountId, amount);
    res.status(200).json(result);
  } catch (err: any) {
    const status = typeof err.status === 'number' ? err.status : 500;
    const error = err.error || 'Internal server error';
    res.status(status).json({ error });
  }
}

export default postWithdrawal;

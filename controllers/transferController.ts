import { Request, Response } from 'express';
import transfer from '../services/transferService';

const postTransfer = async (req: Request, res: Response) => {
  const fromAccountId = Number(req.params.fromAccountId);
  const toAccountId = Number(req.body.toAccountId);
  const amount = Number(req.body.amount);

  try {
    const result = await transfer(fromAccountId, toAccountId, amount);
    res.status(200).json(result);
  } catch (err: any) {
    const status = typeof err.status === 'number' ? err.status : 500;
    const error = err.error || err.message || 'Internal server error';
    res.status(status).json({ error });
  }
};

export default postTransfer;

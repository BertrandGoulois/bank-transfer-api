import { Request, Response } from 'express';
import history from '../services/historyService';

const getHistory = async (req: Request, res: Response) => {
  const accountId = Number(req.params.accountId);

  try {
    const result = await history(accountId);
    res.status(200).json(result);
  } catch (err: any) {
    const status = typeof err.status === 'number' ? err.status : 500;
    const error = err.error || 'Internal server error';
    res.status(status).json({ error });
  }
};

export default getHistory;
import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // log for debugging
  const status = err.status ?? 500;
  const message = err.message ?? 'Internal server error';
  res.status(status).json({ error: message });
};

export default errorHandler;

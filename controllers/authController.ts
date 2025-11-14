import { Request, Response } from 'express';
import loginService from '../services/authService';

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const token = await loginService(email, password);

    res.status(200).json({ token });
  } catch (err: any) {
    const status = err.status ?? 401;
    const msg = err.error ?? 'Authentication failed';

    res.status(status).json({ error: msg });
  }
};

export default login;

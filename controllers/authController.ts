import { Request, Response } from 'express';
import loginService from '../services/authService';

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const token = await loginService(email, password);
    res.status(200).json({ token });
  } catch (err: any) {
    const status = err.status || 401;
    res.status(status).json({ error: err.message });
  }
}

export default login;

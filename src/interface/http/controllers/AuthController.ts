import { Request, Response } from 'express';
import { Login } from '../../../application/use-cases/Login';
import { SequelizeUserRepository } from '../../../infrastructure/db/repositories/SequelizeUserRepository';
import { loginSchema } from '../../../schemas/auth/loginSchema';

const userRepo = new SequelizeUserRepository();
const loginUseCase = new Login(userRepo);

export class AuthController {
  async login(req: Request, res: Response) {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map(i => ({ field: i.path.join('.'), message: i.message }));
      return res.status(400).json({ errors });
    }
    const { email, password } = parsed.data;
    try {
      const token = await loginUseCase.execute(email, password);
      res.status(200).json({ token });
    } catch (err: any) {
      res.status(err.status ?? 401).json({ error: err.message ?? 'Authentication failed' });
    }
  }
}

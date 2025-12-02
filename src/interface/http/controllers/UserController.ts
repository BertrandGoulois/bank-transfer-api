import { Request, Response } from 'express';
import { SequelizeUserRepository } from '../../../infrastructure/db/repositories/SequelizeUserRepository';
import { getByIdSchema } from '../../../schemas/user/getByIdSchema';
import { getByEmailSchema } from '../../../schemas/user/getByEmailSchema';

const userRepo = new SequelizeUserRepository();

export class UserController {
  async getById(req: Request, res: Response) {
    const parsed = getByIdSchema.safeParse(req.params);
    if (!parsed.success) {
      const errors = parsed.error.issues.map(i => ({ field: i.path.join('.'), message: i.message }));
      return res.status(400).json({ errors });
    }
    const { id } = parsed.data;
    try {

      const user = await userRepo.findById(id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.status(200).json(user);
    } catch {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  }

  async getByEmail(req: Request, res: Response) {
    const parsed = getByEmailSchema.safeParse(req.params);
    if (!parsed.success) {
      const errors = parsed.error.issues.map(i => ({ field: i.path.join('.'), message: i.message }));
      return res.status(400).json({ errors });
    }
    const { email } = parsed.data;
    try {
      const user = await userRepo.findByEmail(email);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.status(200).json(user);
    } catch {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const users = await userRepo.findAll();
      res.status(200).json(users);
    } catch {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }
}

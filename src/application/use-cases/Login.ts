import { UserRepository } from '../../domain/repositories/UserRepository';
import jwt from 'jsonwebtoken';

export class Login {
  constructor(
    private userRepo: UserRepository
  ) {}

  async execute(email: string, password: string): Promise<string> {
    const user = await this.userRepo.findByEmail(email);
    if (!user || !(await user.validatePassword(password))) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: '1h'
    });

    return token;
  }
}

import { User } from '../entities';

export interface UserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  save(user: User): Promise<void>;
  create(user: User): Promise<User>;
  
}
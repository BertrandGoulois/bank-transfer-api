import { Account } from '../entities';

export interface AccountRepository {
  findById(id: number, lock?: boolean): Promise<Account | null>;
  findByUserId(userId: number, lock?: boolean): Promise<Account[]>;
  save(account: Account): Promise<void>;
  create(account: Account): Promise<Account>;

  transaction<T>(callback: (t?: unknown) => Promise<T>): Promise<T>;
}
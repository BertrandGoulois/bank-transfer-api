import { Transaction } from '../entities';

export interface TransactionRepository {
  findById(id: number): Promise<Transaction | null>;
  findByAccountId(accountId: number): Promise<Transaction[]>;
  save(transaction: Transaction): Promise<void>;
  create(transaction: Transaction): Promise<Transaction>;
}
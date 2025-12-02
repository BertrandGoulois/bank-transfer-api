import { Transaction } from '../../src/domain/entities/Transaction';

export function makeTransaction(overrides?: Partial<Transaction>): Transaction {
  const now = new Date();
  return new Transaction(
    overrides?.id ?? 0,
    overrides?.accountId ?? 1,
    overrides?.type ?? 'DEPOSIT',
    overrides?.amount ?? 100,
    overrides?.description,
    overrides?.createdAt ?? now
  );
}

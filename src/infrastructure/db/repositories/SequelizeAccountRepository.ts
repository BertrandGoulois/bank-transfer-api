import { AccountRepository } from '../../../domain/repositories';
import { Account } from '../../../domain/entities';
import { AccountModel } from '../models';
import { sequelize } from '../../db/sequelize';
import { LOCK, Transaction as SequelizeTransaction } from 'sequelize';

export class SequelizeAccountRepository implements AccountRepository {
  async findById(id: number, lock = false): Promise<Account | null> {
    const record = await AccountModel.findByPk(id, {
      lock: lock ? LOCK.UPDATE : undefined
    });
    if (!record) return null;
    return this.toDomain(record);
  }

  async findByUserId(userId: number, lock = false): Promise<Account[]> {
    const records = await AccountModel.findAll({
      where: { userId },
      lock: lock ? LOCK.UPDATE : undefined
    });
    return records.map(r => this.toDomain(r));
  }

  async save(account: Account): Promise<void> {
    await AccountModel.update(
      { balance: account.balance, type: account.type },
      { where: { id: account.id } }
    );
  }

  async create(account: Account): Promise<Account> {
    const record = await AccountModel.create({
      id: account.id,
      userId: account.userId,
      balance: account.balance,
      type: account.type
    });
    return this.toDomain(record);
  }

  async transaction<T>(callback: (t: SequelizeTransaction) => Promise<T>): Promise<T> {
    return sequelize.transaction(async (t) => callback(t));
  }

  private toDomain(record: AccountModel): Account {
    return new Account(
      record.id,
      record.userId,
      typeof record.balance === 'string' ? parseFloat(record.balance) : record.balance,
      record.type
    );
  }
}

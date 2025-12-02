import { TransactionRepository } from '../../../domain/repositories';
import { Transaction } from '../../../domain/entities';
import { TransactionModel } from '../models/TransactionModel';


export class SequelizeTransactionRepository implements TransactionRepository {
    async findById(id: number): Promise<Transaction | null> {
        const record = await TransactionModel.findByPk(id);
        if (!record) return null;
        return this.toDomain(record);
    }

    async findByAccountId(accountId: number): Promise<Transaction[]> {
        const records = await TransactionModel.findAll({ where: { accountId } });
        return records.map(r => this.toDomain(r));
    }

    async save(transaction: Transaction): Promise<void> {
        await TransactionModel.update(
            { accountId: transaction.accountId, type: transaction.type, amount: transaction.amount, description: transaction.description },
            { where: { id: transaction.id } }
        );
    }

    async create(transaction: Transaction): Promise<Transaction> {
        const record = await TransactionModel.create({
            id: transaction.id,
            accountId: transaction.accountId,
            type: transaction.type,
            amount: transaction.amount,
            description: transaction.description
        });
        return this.toDomain(record);
    }

    private toDomain(record: TransactionModel): Transaction {
        if (!['DEPOSIT', 'WITHDRAWAL', 'TRANSFER'].includes(record.type)) {
            throw new Error('Invalid transaction type from DB');
        }
        const type = record.type as 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
        return new Transaction(
            record.id,
            record.accountId,
            type,
            typeof record.amount === 'string' ? parseFloat(record.amount) : record.amount,
            record.description,
            record.createdAt
        );
    }
}
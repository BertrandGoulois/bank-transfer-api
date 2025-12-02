import { TransactionRepository, AccountRepository } from '../../domain/repositories';
import { Transaction } from '../../domain/entities/Transaction';

export interface TransactionStatsDTO {
    averageAmount: number;
    byType: Record<string, number>;
    byDay: Record<string, number>;
    transactions: Transaction[];
}

export class GetTransactionStats {
    constructor(
        private accountRepo: AccountRepository,
        private transactionRepo: TransactionRepository
    ) {}

    async execute(accountId: number): Promise<TransactionStatsDTO> {
        return this.accountRepo.transaction(async () => {
            const account = await this.accountRepo.findById(accountId, true);
            if (!account) throw new Error('Account not found');

            const transactions = await this.transactionRepo.findByAccountId(accountId);

            const amounts = transactions.map(t => t.amount);
            const averageAmount =
                amounts.length > 0
                    ? amounts.reduce((a, b) => a + b, 0) / amounts.length
                    : 0;

            const byType = transactions.reduce((acc, t) => {
                acc[t.type] = (acc[t.type] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const byDay = transactions.reduce((acc, t) => {
                const day = t.createdAt.toISOString().split('T')[0];
                acc[day] = (acc[day] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            return {
                averageAmount,
                byType,
                byDay,
                transactions
            };
        });
    }
}

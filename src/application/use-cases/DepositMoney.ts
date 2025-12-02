import { AccountRepository, TransactionRepository } from '../../domain/repositories';
import { Transaction } from '../../domain/entities/Transaction';

export class DepositMoney {
    constructor(
        private accountRepo: AccountRepository,
        private transactionRepo: TransactionRepository
    ) { }

    async execute(id: number, amount: number) {
        await this.accountRepo.transaction(async (t) => {
            const account = await this.accountRepo.findById(id);
            if (!account) throw new Error('Account not found');

            account.deposit(amount);

            await this.accountRepo.save(account);

            const transaction = new Transaction(
                0,
                account.id,
                'DEPOSIT',
                amount
            );

            await this.transactionRepo.create(transaction);
        });
    }
}
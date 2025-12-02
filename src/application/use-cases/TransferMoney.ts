import { TransactionRepository, AccountRepository } from '../../domain/repositories';
import { Transaction } from '../../domain/entities/Transaction';

export class TransferMoney {
  constructor(
    private accountRepo: AccountRepository,
    private transactionRepo: TransactionRepository
  ) { }

  async execute(fromId: number, toId: number, amount: number) {
    await this.accountRepo.transaction(async (t) => {

      const fromAccount = await this.accountRepo.findById(fromId, true);
      const toAccount = await this.accountRepo.findById(toId, true);

      if (!fromAccount || !toAccount) throw new Error('Account not found');
      if (fromAccount.balance < amount) throw new Error('Insufficient balance');

      fromAccount.withdraw(amount);
      toAccount.deposit(amount);

      await this.accountRepo.save(fromAccount);
      await this.accountRepo.save(toAccount);

      const transaction = new Transaction(
        0,
        fromAccount.id,
        'TRANSFER',
        amount
      );
      await this.transactionRepo.create(transaction);
    });
  }
}

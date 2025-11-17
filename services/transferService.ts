import { sequelize, AccountModel, TransactionModel } from '../models';
import { TransferResult } from '../interfaces/transactions';
import { Transaction } from 'sequelize';

const transfer = async (
  fromAccountId: number,
  toAccountId: number,
  amount: number
): Promise<TransferResult> => {
  const t: Transaction = await sequelize.transaction();

  try {
    const fromAccount = await AccountModel.findByPk(fromAccountId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!fromAccount) throw { status: 404, error: 'Sender account not found' };

    const toAccount = await AccountModel.findByPk(toAccountId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!toAccount) throw { status: 404, error: 'Receiver account not found' };

    if (parseFloat(fromAccount.balance) < amount)
      throw { status: 400, error: 'Insufficient balance' };

    fromAccount.balance = (parseFloat(fromAccount.balance) - amount).toString();
    toAccount.balance = (parseFloat(toAccount.balance) + amount).toString();

    await fromAccount.save({ transaction: t });
    await toAccount.save({ transaction: t });

    await TransactionModel.create(
      {
        accountId: fromAccountId,
        type: 'debit',
        amount: amount.toString(),
        description: `Transfer to ${toAccountId}`,
      },
      { transaction: t }
    );

    await TransactionModel.create(
      {
        accountId: toAccountId,
        type: 'credit',
        amount: amount.toString(),
        description: `Transfer from ${fromAccountId}`,
      },
      { transaction: t }
    );

    await t.commit();

    return {
      message: 'Transfer successful',
      fromAccountId,
      toAccountId,
      amount,
    };
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

export default transfer;

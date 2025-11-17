import { sequelize, AccountModel, TransactionModel } from '../models';
import { WithdrawResult } from '../interfaces/transactions';
import { Transaction } from 'sequelize';

const withdraw = async (
  accountId: number,
  amount: number
): Promise<WithdrawResult> => {
  const t: Transaction = await sequelize.transaction();

  try {
    const account = await AccountModel.findByPk(accountId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!account) throw { status: 404, error: 'Account not found' };

    if (parseFloat(account.balance) < amount)
      throw { status: 400, error: 'Insufficient balance' };

    account.balance = (parseFloat(account.balance) - amount).toString();

    await account.save({ transaction: t });

    await TransactionModel.create(
      {
        accountId,
        type: 'debit',
        amount: amount.toString(),
        description: `Withdrawal of ${amount} on account ${accountId}`,
      },
      { transaction: t }
    );

    await t.commit();
    return { message: 'Withdrawal successful', accountId, amount };
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

export default withdraw;

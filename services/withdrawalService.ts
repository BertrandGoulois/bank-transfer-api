import { sequelize } from '../models';
import { WithdrawResult, AccountRow } from '../interfaces/transactions';
import { QueryTypes, Transaction } from 'sequelize';

const withdraw = async (
  accountId: number,
  amount: number
): Promise<WithdrawResult> => {
  const t: Transaction = await sequelize.transaction();

  try {
    const accounts = await sequelize.query<AccountRow>(
      `SELECT * FROM "Accounts" WHERE id = $id FOR UPDATE`,
      {
        bind: { id: accountId },
        type: QueryTypes.SELECT,
        transaction: t,
      }
    );
    const account = accounts[0];
    if (!account) throw { status: 404, error: 'Account not found' };
    if (parseFloat(account.balance) < amount)
      throw { status: 400, error: 'Insufficient balance' };

    await sequelize.query(
      `UPDATE "Accounts" SET balance = balance - $amount, "updatedAt" = NOW() WHERE id = $id`,
      { bind: { id: accountId, amount }, transaction: t }
    );

    await sequelize.query(
      `INSERT INTO "Transactions" ("accountId","type","amount","description","createdAt","updatedAt")
       VALUES ($accountId,'debit',$amount,$desc,NOW(),NOW())`,
      {
        bind: {
          accountId,
          amount,
          desc: `Withdrawal of ${amount} on account ${accountId}`,
        },
        transaction: t,
      }
    );

    await t.commit();
    return { message: 'Withdrawal successful', accountId, amount };
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

export default withdraw;

import { sequelize } from '../models/index';
import { WithdrawResult } from '../interfaces/transactions';
import { QueryTypes, Transaction } from 'sequelize';

const withdraw = async (accountId: number, amount: number): Promise<WithdrawResult> => {
  console.log(`Withdraw service called: from ${accountId}, amount ${amount}`);
  const t: Transaction = await sequelize.transaction();

  try {
    const [fromAccount]: any = await sequelize.query(
      `SELECT * FROM "Accounts" WHERE id = $id FOR UPDATE`,
      {
        bind: { id: accountId },
        type: QueryTypes.SELECT,
        transaction: t,
      }
    );

    if (!fromAccount) throw { status: 404, error: 'Account not found' };
    if (parseFloat(fromAccount.balance) < amount)
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
    console.log(`Withdrawal completed on account ${accountId}, amount ${amount}`);

    return { message: 'Withdrawal successful', accountId, amount };
  } catch (err) {
    await t.rollback();
    console.error('Withdraw failed:', err);
    throw err;
  }
};

export default withdraw;

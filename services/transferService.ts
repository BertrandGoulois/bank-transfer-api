import { sequelize } from '../models';
import { TransferResult, AccountRow } from '../interfaces/transactions';
import { QueryTypes, Transaction } from 'sequelize';

const transfer = async (
  fromAccountId: number,
  toAccountId: number,
  amount: number
): Promise<TransferResult> => {
  const t: Transaction = await sequelize.transaction();

  try {
    const fromRows = await sequelize.query<AccountRow>(
      `SELECT * FROM "Accounts" WHERE id = $id FOR UPDATE`,
      { bind: { id: fromAccountId }, type: QueryTypes.SELECT, transaction: t }
    );
    const fromAccount = fromRows[0];
    if (!fromAccount) throw { status: 404, error: 'Sender account not found' };

    const toRows = await sequelize.query<AccountRow>(
      `SELECT * FROM "Accounts" WHERE id = $id FOR UPDATE`,
      { bind: { id: toAccountId }, type: QueryTypes.SELECT, transaction: t }
    );
    const toAccount = toRows[0];
    if (!toAccount) throw { status: 404, error: 'Receiver account not found' };

    if (parseFloat(fromAccount.balance) < amount)
      throw { status: 400, error: 'Insufficient balance' };

    await sequelize.query(
      `UPDATE "Accounts" SET balance = balance - $amount, "updatedAt" = NOW() WHERE id = $id`,
      { bind: { id: fromAccountId, amount }, transaction: t }
    );
    await sequelize.query(
      `UPDATE "Accounts" SET balance = balance + $amount, "updatedAt" = NOW() WHERE id = $id`,
      { bind: { id: toAccountId, amount }, transaction: t }
    );

    await sequelize.query(
      `INSERT INTO "Transactions" ("accountId","type","amount","description","createdAt","updatedAt")
       VALUES ($accountId,'debit',$amount,$desc,NOW(),NOW())`,
      { bind: { accountId: fromAccountId, amount, desc: `Transfer to ${toAccountId}` }, transaction: t }
    );
    await sequelize.query(
      `INSERT INTO "Transactions" ("accountId","type","amount","description","createdAt","updatedAt")
       VALUES ($accountId,'credit',$amount,$desc,NOW(),NOW())`,
      { bind: { accountId: toAccountId, amount, desc: `Transfer from ${fromAccountId}` }, transaction: t }
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

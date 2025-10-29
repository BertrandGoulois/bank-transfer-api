const { sequelize } = require('../models');

async function transfer(fromAccountId, toAccountId, amount) {
  console.log(`Transfer service called: from ${fromAccountId} to ${toAccountId}, amount ${amount}`);

  if (fromAccountId === toAccountId)
    throw { status: 400, error: 'Sender and receiver must be different' };

  const t = await sequelize.transaction();

  try {
    const [fromAccount] = await sequelize.query(
      `SELECT * FROM "Accounts" WHERE id = $id FOR UPDATE`,
      { bind: { id: fromAccountId }, type: sequelize.QueryTypes.SELECT, transaction: t }
    );
    if (!fromAccount) throw { status: 404, error: 'Sender account not found' };

    const [toAccount] = await sequelize.query(
      `SELECT * FROM "Accounts" WHERE id = $id FOR UPDATE`,
      { bind: { id: toAccountId }, type: sequelize.QueryTypes.SELECT, transaction: t }
    );
    if (!toAccount) throw { status: 404, error: 'Receiver account not found' };

    if (parseFloat(fromAccount.balance) < amount)
      throw { status: 400, error: 'Insufficient balance' };

    await sequelize.query(
      `UPDATE "Accounts" SET balance = balance - $amount, "updatedAt" = NOW() WHERE id = $id`,
      { bind: { id: fromAccountId, amount: amount }, transaction: t }
    );
    await sequelize.query(
      `UPDATE "Accounts" SET balance = balance + $amount, "updatedAt" = NOW() WHERE id = $id`,
      { bind: { id: toAccountId, amount: amount }, transaction: t }
    );

    await sequelize.query(
      `INSERT INTO "Transactions" ("accountId","type","amount","description","createdAt","updatedAt")
       VALUES ($accountId,'debit',$amount,$desc,NOW(),NOW())`,
      { bind: { accountId: fromAccountId, amount: amount, desc: `Transfer to ${toAccountId}` }, transaction: t }
    );
    await sequelize.query(
      `INSERT INTO "Transactions" ("accountId","type","amount","description","createdAt","updatedAt")
       VALUES ($accountId,'credit',$amount,$desc,NOW(),NOW())`,
      { bind: { accountId: toAccountId, amount: amount, desc: `Transfer from ${fromAccountId}` }, transaction: t }
    );

    await t.commit();
    console.log(`Transfer completed: from ${fromAccountId} to ${toAccountId}, amount ${amount}`);
    return { message: 'Transfer successful', fromAccountId, toAccountId, amount: amount };
  } catch (err) {
    if (!t.finished) await t.rollback();
    console.error('Transfer failed:', err);
    throw err;
  }
}

module.exports = { transfer };
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



async function withdraw(accountId, amount) {
  console.log(`Withdraw service called: from ${accountId}, amount ${amount}`);
  const t = await sequelize.transaction();
  try {
    const [fromAccount] = await sequelize.query(
      `SELECT * FROM "Accounts" WHERE id = $id FOR UPDATE`,
      { bind: { id: accountId }, type: sequelize.QueryTypes.SELECT, transaction: t }
    );
    if (!fromAccount) throw { status: 404, error: 'Compte introuvable' };

    if (parseFloat(fromAccount.balance) < amount)
      throw { status: 400, error: 'Solde insuffisant' };

    await sequelize.query(
      `UPDATE "Accounts" SET balance = balance - $amount, "updatedAt" = NOW() WHERE id = $id`,
      { bind: { id: accountId, amount: amount }, transaction: t }
    );

    await sequelize.query(
      `INSERT INTO "Transactions" ("accountId","type","amount","description","createdAt","updatedAt")
       VALUES ($accountId,'debit',$amount,$desc,NOW(),NOW())`,
      { bind: { accountId: accountId, amount: amount, desc: `Withdraw of ${amount}  euros on ${accountId} ` }, transaction: t }
    );

    await t.commit();
    console.log(`Withdrawal completed on account ${accountId} , amount ${amount}`);

    return { message: 'Retrait réussi', accountId, amount: amount };
  } catch (err) {
    if (!t.finished) await t.rollback();
    console.error('Withdraw failed:', err);
    throw err;
  }
}

async function history(accountId) {
  console.log(`History service called for account id ${accountId}`);
  const t = await sequelize.transaction();
  try {
    const [fromAccount] = await sequelize.query(
      `SELECT * FROM "Accounts" WHERE id = $id FOR UPDATE`,
      { bind: { id: accountId }, type: sequelize.QueryTypes.SELECT, transaction: t }
    );
    if (!fromAccount) throw { status: 404, error: 'Compte introuvable' };

    const transactions = await sequelize.query(
      `SELECT * FROM "Transactions" WHERE "accountId" = $id`,
      { bind: { id: accountId }, type: sequelize.QueryTypes.SELECT, transaction: t }
    );

    const amounts = transactions.map(t => parseFloat(t.amount));
    const averageAmount = amounts.length ? amounts.reduce((a, b) => a + b, 0) / amounts.length : 0;

    const byType = transactions.reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1;
      return acc;
    }, {});

    const byDay = transactions.reduce((acc, t) => {
      const day = t.createdAt.toISOString().split('T')[0];
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});

    await t.commit();

    return {
      message: 'Endpoint history atteint',
      metrics: { averageAmount, byType, byDay },
      transactions
    };
  } catch (err) {
    if (!t.finished) await t.rollback();
    console.error('History failed:', err);
    throw err;
  }
}


module.exports = { transfer, withdraw, history };

const { sequelize } = require('../models');

/**
 * Withdraws an amount from an account.
 * @param {number} accountId - ID of the account to withdraw from.
 * @param {number} amount - Amount to withdraw.
 * @throws {Object} Throws an error with `status` and `error` if withdrawal fails.
 * @returns {Promise<Object>} Object containing withdrawal result.
 */
async function withdraw(accountId, amount) {
  console.log(`Withdraw service called: from ${accountId}, amount ${amount}`);
  const t = await sequelize.transaction();
  try {
    const [fromAccount] = await sequelize.query(
      `SELECT * FROM "Accounts" WHERE id = $id FOR UPDATE`,
      { bind: { id: accountId }, type: sequelize.QueryTypes.SELECT, transaction: t }
    );
    if (!fromAccount) throw { status: 404, error: 'Account not found' };

    if (parseFloat(fromAccount.balance) < amount)
      throw { status: 400, error: 'Insufficient balance' };

    await sequelize.query(
      `UPDATE "Accounts" SET balance = balance - $amount, "updatedAt" = NOW() WHERE id = $id`,
      { bind: { id: accountId, amount: amount }, transaction: t }
    );

    await sequelize.query(
      `INSERT INTO "Transactions" ("accountId","type","amount","description","createdAt","updatedAt")
       VALUES ($accountId,'debit',$amount,$desc,NOW(),NOW())`,
      { bind: { accountId: accountId, amount: amount, desc: `Withdrawal of ${amount} on account ${accountId}` }, transaction: t }
    );

    await t.commit();
    console.log(`Withdrawal completed on account ${accountId}, amount ${amount}`);

    return { message: 'Withdrawal successful', accountId, amount: amount };
  } catch (err) {
    if (!t.finished) await t.rollback();
    console.error('Withdraw failed:', err);
    throw err;
  }
}

module.exports = { withdraw };
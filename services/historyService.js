const { sequelize } = require('../models');

async function history(accountId) {
  console.log(`History service called for account id ${accountId}`);
  const t = await sequelize.transaction();
  try {
    const [account] = await sequelize.query(
      `SELECT * FROM "Accounts" WHERE id = $id FOR UPDATE`,
      { bind: { id: accountId }, type: sequelize.QueryTypes.SELECT, transaction: t }
    );
    if (!account) throw { status: 404, error: 'Account not found' };

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
      message: 'History endpoint reached',
      metrics: { averageAmount, byType, byDay },
      transactions
    };
  } catch (err) {
    if (!t.finished) await t.rollback();
    console.error('History retrieval failed:', err);
    throw err;
  }
}

module.exports = { history };
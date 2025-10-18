const { sequelize } = require('../models');

async function transfer(fromAccountId, toAccountId, amount) {
  console.log(`Transfer service called: from ${fromAccountId} to ${toAccountId}, amount ${amount}`);

  // Fetch source account
  const fromRows = await sequelize.query(
    `SELECT * FROM "Accounts" WHERE id = $id`,
    { bind: { id: fromAccountId }, type: sequelize.QueryTypes.SELECT }
  );
  const fromAccount = fromRows[0];
  if (!fromAccount) throw { status: 404, error: 'Compte source introuvable' };

  // Fetch destination account
  const toRows = await sequelize.query(
    `SELECT * FROM "Accounts" WHERE id = $id`,
    { bind: { id: toAccountId }, type: sequelize.QueryTypes.SELECT }
  );
  const toAccount = toRows[0];
  if (!toAccount) throw { status: 404, error: 'Compte destination introuvable' };

  // Placeholder for balance check and transaction logic
  return { message: 'Transfer service reached' };
}

module.exports = { transfer };

const { sequelize } = require('../models');

async function transfer(fromAccountId, toAccountId, amount) {
  console.log(`Transfer service called: from ${fromAccountId} to ${toAccountId}, amount ${amount}`);

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0)
    throw { status: 400, error: 'Montant invalide' };
  if (fromAccountId === toAccountId)
    throw { status: 400, error: 'Les deux comptes ne peuvent être identiques' };

  const t = await sequelize.transaction();

  try {
    const [fromAccount] = await sequelize.query(
      `SELECT * FROM "Accounts" WHERE id = $id FOR UPDATE`,
      { bind: { id: fromAccountId }, type: sequelize.QueryTypes.SELECT, transaction: t }
    );
    if (!fromAccount) throw { status: 404, error: 'Compte source introuvable' };

    const [toAccount] = await sequelize.query(
      `SELECT * FROM "Accounts" WHERE id = $id FOR UPDATE`,
      { bind: { id: toAccountId }, type: sequelize.QueryTypes.SELECT, transaction: t }
    );
    if (!toAccount) throw { status: 404, error: 'Compte destination introuvable' };

    if (parseFloat(fromAccount.balance) < parsedAmount)
      throw { status: 400, error: 'Solde insuffisant' };

    await sequelize.query(
      `UPDATE "Accounts" SET balance = balance - $amount, "updatedAt" = NOW() WHERE id = $id`,
      { bind: { id: fromAccountId, amount: parsedAmount }, transaction: t }
    );
    await sequelize.query(
      `UPDATE "Accounts" SET balance = balance + $amount, "updatedAt" = NOW() WHERE id = $id`,
      { bind: { id: toAccountId, amount: parsedAmount }, transaction: t }
    );

    await sequelize.query(
      `INSERT INTO "Transactions" ("accountId","type","amount","description","createdAt","updatedAt")
       VALUES ($accountId,'debit',$amount,$desc,NOW(),NOW())`,
      { bind: { accountId: fromAccountId, amount: parsedAmount, desc: `Transfer to ${toAccountId}` }, transaction: t }
    );
    await sequelize.query(
      `INSERT INTO "Transactions" ("accountId","type","amount","description","createdAt","updatedAt")
       VALUES ($accountId,'credit',$amount,$desc,NOW(),NOW())`,
      { bind: { accountId: toAccountId, amount: parsedAmount, desc: `Transfer from ${fromAccountId}` }, transaction: t }
    );

    await t.commit();
    console.log(`Transfer completed: from ${fromAccountId} to ${toAccountId}, amount ${parsedAmount}`);
    return { message: 'Transfert réussi', fromAccountId, toAccountId, amount: parsedAmount };
  } catch (err) {
    await t.rollback();
    console.error('Transfer failed:', err);
    throw err;
  }
}


async function withdraw(AccountId, amount){
  console.log(`Withdraw service called: from ${AccountId}, amount ${amount}`);
  return { message: 'Endpoint withdraw atteint'};
}

module.exports = { transfer, withdraw };

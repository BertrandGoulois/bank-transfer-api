const { transfer, withdraw, history } = require('../services/accountService');

async function postTransfer(req, res) {
  const fromAccountId = Number(req.params.fromAccountId);
  const toAccountId = Number(req.body.toAccountId);
  const amount = Number(req.body.amount);

  if (!Number.isInteger(fromAccountId) || fromAccountId <= 0)
    return res.status(400).json({ error: 'Identifiant de compte source invalide' });

  if (!Number.isInteger(toAccountId) || toAccountId <= 0)
    return res.status(400).json({ error: 'Identifiant de compte destination invalide' });

  if (isNaN(amount) || amount <= 0)
    return res.status(400).json({ error: 'Montant invalide' });

  if (fromAccountId === toAccountId)
    return res.status(400).json({ error: 'Les deux comptes ne peuvent être identiques' });

  try {
    const result = await transfer(fromAccountId, toAccountId, amount);
    res.status(200).json(result);
  } catch (err) {
    console.error('Caught error in controller:', err);
    const status = typeof err.status === 'number' ? err.status : 500;
    const error = err.error || err.message || 'Internal server error';
    res.status(status).json({ error });
  }
}

async function postWithdrawal(req, res) {
  const accountId = Number(req.params.accountId);
  const amount = Number(req.body.amount);

  if (!Number.isInteger(accountId) || accountId <= 0)
    return res.status(400).json({ error: 'Identifiant de compte invalide' });

  if (isNaN(amount) || amount <= 0)
    return res.status(400).json({ error: 'Montant invalide' });

  try {
    const result = await withdraw(accountId, amount);
    res.status(200).json(result);
  } catch (err) {
    console.log('Caught error in controller:', err);
    const status = typeof err.status === 'number' ? err.status : 500;
    const error = err.error || err.message || 'Internal server error';
    res.status(status).json({ error });
  }
}

async function getHistory(req, res){
  const { accountId } = req.params;
  try {
    const result = await history(accountId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { postTransfer, postWithdrawal, getHistory };
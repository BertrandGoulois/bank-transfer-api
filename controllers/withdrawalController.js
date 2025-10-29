const { withdraw } = require('../services/withdrawalService');

async function postWithdrawal(req, res) {
  const accountId = Number(req.params.accountId);
  const amount = Number(req.body.amount);

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

module.exports = { postWithdrawal };

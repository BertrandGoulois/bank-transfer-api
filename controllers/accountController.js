const { transfer } = require('../services/accountService');

async function postTransfer(req, res) {
  const fromAccountId = parseInt(req.params.fromAccountId, 10);
  const toAccountId = parseInt(req.body.toAccountId, 10);
  const amount = parseFloat(req.body.amount);

  if (fromAccountId === toAccountId) {
    return res.status(400).json({ error: 'Les deux comptes ne peuvent être identiques' });
  }

  try {
    const result = await transfer(fromAccountId, toAccountId, amount);
    res.status(200).json(result);
  } catch (err) {
    console.log('Caught error in controller:', err);
    const status = typeof err.status === 'number' ? err.status : 500;
    const error = err.error || err.message || 'Internal server error';
    res.status(status).json({ error });
  }
}

module.exports = { postTransfer };
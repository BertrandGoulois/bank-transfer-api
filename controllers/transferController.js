const { transfer } = require('../services/transferService');

async function postTransfer(req, res) {
  const fromAccountId = Number(req.params.fromAccountId);
  const toAccountId = Number(req.body.toAccountId);
  const amount = Number(req.body.amount);

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

module.exports = { postTransfer };
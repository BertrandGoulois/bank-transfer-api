const { transfer } = require('../services/accountService');

async function postTransfer(req, res) {
  const { fromAccountId } = req.params;
  const { toAccountId, amount } = req.body;

  if (fromAccountId === toAccountId) {
    return res.status(400).json({ error: 'Les deux comptes ne peuvent être identiques' });
  }

  try {
    const result = await transfer(fromAccountId, toAccountId, amount);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { postTransfer };

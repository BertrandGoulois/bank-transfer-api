const { history } = require('../services/historyService');

/**
 * Handles GET /history request.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getHistory(req, res) {
  const accountId = Number(req.params.accountId);
  try {
    const result = await history(accountId);
    res.status(200).json(result);
  } catch (err) {
    console.log('Caught error in controller:', err);
    const status = typeof err.status === 'number' ? err.status : 500;
    const error = err.error || err.message || 'Internal server error';
    res.status(status).json({ error });
  }
}

module.exports = { getHistory };
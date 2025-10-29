function validateWithdrawalInput(req, res, next) {
    const accountId = req.params.accountId;
    const { amount } = req.body;

    if (!accountId) {
        return res.status(400).json({ error: 'Missing account id' });
    }

    if (isNaN(Number(accountId))) {
        return res.status(400).json({ error: 'Invalid account id' });
    }

    if (amount === undefined) {
        return res.status(400).json({ error: 'Missing amount' });
    }

    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    next();
}

module.exports = validateWithdrawalInput;

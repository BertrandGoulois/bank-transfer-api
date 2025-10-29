function validateTransferInput(req, res, next) {
    const senderAccount = req.params.fromAccountId;
    const { toAccountId, amount } = req.body;

    if (!toAccountId || amount === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (isNaN(Number(senderAccount))) {
        return res.status(400).json({ error: 'Invalid sender account id' });
    }

    if (isNaN(Number(toAccountId))) {
        return res.status(400).json({ error: 'Invalid destination account id' });
    }

    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    if (Number(senderAccount) === Number(toAccountId)) {
        return res.status(400).json({ error: 'Sender and receiver must be different' });
    }

    next();
}


module.exports = validateTransferInput;
